const express = require('express');
const router = express.Router();
const pool = require('./db');


// GET → returns all available trips
router.get('/trips', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *, (base_price * duration) AS total_price
      FROM view_trip_catalog
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET → returns the top 5 booked trips
router.get('/trips/top-booked', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_top_booked_trips()');
    res.json(rows[0]); // ✅ unpack result set
  } catch (err) {
    console.error('Error fetching top booked trips:', err);
    res.status(500).json({ error: 'Failed to fetch top booked trips' });
  }
});

// GET → returns all available insurance options 
router.get('/insurance-options', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM travel_insurance_option');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching insurance options:', err);
    res.status(500).json({ error: 'Failed to fetch insurance options' });
  }
});


// GET → returns booking details by confirmation code
router.get('/bookings/by-code/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const [bookingRows] = await pool.query(
      `SELECT * FROM view_booking_details WHERE confirmation_code = ?`,
      [code ]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingRows[0];

    // Call total spending SP
    const [spendingRows] = await pool.query('CALL sp_get_total_spent(?)', [booking.customer_id]);
    const totalSpent = spendingRows[0][0]?.total_spent || 0;

    res.json({ success: true, booking: { ...booking, total_spent: totalSpent } });
  } catch (err) {
    console.error(' Lookup failed:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST → cancels a booking by confirmation code
router.post('/bookings/cancel', async (req, res) => {
  const { confirmationCode } = req.body;
  const pool = require('./db');


  try {
    if (!confirmationCode) {
      return res.status(400).json({ success: false, message: 'Missing confirmation code' });
    }


    // Step 1: Find the booking ID from the confirmation code
    const [rows] = await pool.query(
      `SELECT booking_id FROM booking WHERE confirmation_code = ?`,
      [confirmationCode]
    );


    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }


    const bookingId = rows[0].booking_id;


    // Step 2: Call the stored procedure to cancel
    await pool.query(`CALL sp_cancel_booking(?)`, [bookingId]);


    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (err) {
    console.error('❌ Booking cancel failed:', err);
    res.status(500).json({ success: false, error: 'Server error while cancelling booking.' });
  }
});


// POST → creates a new booking
// POST → creates a new booking
router.post('/bookings', async (req, res) => {
  console.log("📦 Full booking payload:", req.body);
  const {
    tripId,
    startDate,
    endDate,
    insuranceId,
    departureFlightId,
    returnFlightId,
    hotelId,
    customer
  } = req.body;

  const { firstName, middleName, lastName, email, phone } = customer;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Check if customer exists by email
    const [existingCustomer] = await conn.query(
      'SELECT customer_id FROM customer WHERE email = ?',
      [email]
    );

    let customerId;
    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].customer_id;
    } else {
      const [result] = await conn.query(
        `INSERT INTO customer (first_name, middle_name, last_name, email, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [firstName, middleName || null, lastName, email, phone]
      );
      customerId = result.insertId;
    }

    // 2. Call stored procedure to add booking
    const [bookingResult] = await conn.query(
      `CALL sp_add_booking_with_capacity_check(?, ?, ?, ?, ?, ?)`,
      [customerId, tripId, startDate, endDate, insuranceId || null, req.body.total_price || 0]
    );

    const { booking_id, confirmation_code, total_price: sp_total_price } = bookingResult[0][0];
    const final_total_price = typeof req.body.total_price === 'number' ? req.body.total_price : sp_total_price;

    console.log('🧾 Booking created:', booking_id);
    console.log('🏨 Hotel ID:', hotelId);
    console.log('🛫 Departure Flight ID:', departureFlightId);
    console.log('🛬 Return Flight ID:', returnFlightId);

    // 3. Link hotel
    if (hotelId) {
      try {
        await conn.query(
          `INSERT INTO booking_hotel (booking_id, hotel_id) VALUES (?, ?)`,
          [booking_id, hotelId]
        );
      } catch (err) {
        console.error('❌ Error inserting hotel:', err);
      }
    }

    // 4. Link departure flight
    if (departureFlightId) {
      try {
        await conn.query(
          `INSERT INTO booking_flight (booking_id, flight_id) VALUES (?, ?)`,
          [booking_id, departureFlightId]
        );
      } catch (err) {
        console.error('❌ Error inserting departure flight:', err);
      }
    }

    // 5. Link return flight (only if different)  
    // if (returnFlightId && returnFlightId !== departureFlightId) {
    //   try {
    //     await conn.query(
    //       `INSERT INTO booking_flight (booking_id, flight_id) VALUES (?, ?)`,
    //       [booking_id, returnFlightId]
    //     );
    //   } catch (err) {
    //     console.error('❌ Error inserting return flight:', err);
    //   }
    // }

    // 6. Insert payment record
    try {
      await conn.query(
        `INSERT INTO payment (booking_id, payment_method, payment_date, amount, payment_status)
         VALUES (?, ?, CURDATE(), ?, ?)`,
        [booking_id, 'Credit Card', final_total_price, 'Pending']
      );
    } catch (err) {
      console.error('❌ Error inserting payment:', err);
    }

    await conn.commit();

    res.status(200).json({
      success: true,
      bookingId: booking_id,
      confirmationCode: confirmation_code,
      totalPrice: final_total_price
    });
  } catch (err) {
    await conn.rollback();

    if (err.code === 'ER_SIGNAL_EXCEPTION' && err.message.includes('overlapping dates')) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this trip during the selected dates.',
      });
    }

    console.error('Booking error:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// POST → adds a new rating for a booking use
router.post('/rating', async (req, res) => {
  const { bookingId, ratingScore, feedback } = req.body;
  console.log('⛳ Inserting rating with:', {
    bookingId,
    ratingScore,
    feedback,
  });

  try {
    const [bookingRows] = await pool.query(
      `SELECT booking_id, customer_id FROM booking WHERE booking_id = ?`,
      [bookingId]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const { booking_id, customer_id } = bookingRows[0];

    const [result] = await pool.query(
      'CALL sp_add_rating(?, ?, ?, ?)',
      [customer_id, booking_id, ratingScore, feedback]
    );

    res.json({ success: true, message: 'Rating added successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST → links a hotel to a booking
router.post('/booking-hotel', async (req, res) => {
  const { bookingId, hotelId } = req.body;

  try {
    await pool.query(
      `INSERT INTO booking_hotel (booking_id, hotel_id) VALUES (?, ?)`,
      [bookingId, hotelId]
    );


    res.status(200).json({ success: true, message: 'Hotel linked to booking successfully.' });
  } catch (err) {
    console.error('Error linking hotel to booking:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET → returns all hotels
router.get('/hotels', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM view_available_hotels_by_trip');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// GET → returns all flights
router.get('/flights', async (req, res) => {
  try {

    await pool.query(`
      UPDATE flight
      SET is_return = (MOD(FLOOR(RAND() * 1000), 2) = 0)
    `);
    const [rows] = await pool.query('SELECT * FROM view_available_flights_by_trip');
    const normalized = rows.map(flight => ({
      ...flight,
      price: Number(flight.flight_price) || 0
    }));
    res.json(normalized);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});
 //use
//  returns top rated trips above a rating threshold
router.get('/trips/top-rated/:minRating', async (req, res) => {
  const { minRating } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_filter_high_rated_trips(?)', [minRating]);
    res.json(rows[0]); 
  } catch (err) {
    console.error('Error fetching top-rated trips:', err);
    res.status(500).json({ error: 'Failed to fetch top-rated trips' });
  }
});

// returns affordable trip packages under a budget use
router.get('/trips/affordable/:budget', async (req, res) => {
  const { budget } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_affordable_trip_packages(?)', [budget]);
    res.json(rows[0]); 
  } catch (err) {
    console.error('Error fetching affordable trips:', err);
    res.status(500).json({ error: 'Failed to fetch affordable trips' });
  }
});
//use
router.get('/trips/cheapest-days', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_predict_cheapest_travel_days()');
    res.json(rows[0]); 
  } catch (err) {
    console.error('Error fetching cheapest travel days:', err);
    res.status(500).json({ error: 'Failed to fetch cheapest travel days' });
  }
});
//use
router.get('/trips/:tripId/ratings', async (req, res) => {
  const { tripId } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_get_rating_distribution(?)', [tripId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching rating distribution:', err);
    res.status(500).json({ error: 'Failed to fetch rating distribution' });
  }
});
//use 
router.get('/trips/:tripId/average-rating', async (req, res) => {
  const { tripId } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_get_trip_average_rating(?)', [tripId]);
    res.json(rows[0][0]); 
  } catch (err) {
    console.error('Error fetching trip average rating:', err);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
});
// use
router.get('/trips/type/:type', async (req, res) => {
  const { type } = req.params;

  try {
    const [rows] = await pool.query('CALL sp_get_trips_by_type(?)', [type]);
    res.json(rows[0]); 
  } catch (err) {
    console.error('Error fetching trips by type:', err);
    res.status(500).json({ error: 'Failed to fetch trips by type' });
  }
});
// returns all customer ratings use
router.get('/customers_ratings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM view_customer_ratings');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// POST → mock complete an existing payment and mark booking completed
router.post('/payments', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Missing bookingId' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Update payment status to Completed
    await conn.query(
      `UPDATE payment SET payment_status = 'Completed' WHERE booking_id = ?`,
      [bookingId]
    );

    // Update booking status to Completed
    await conn.query(
      `CALL sp_update_booking_status(?, ?)`,
      [bookingId, 'Completed']
    );

    await conn.commit();
    res.status(200).json({ success: true, message: 'Payment marked as completed and booking updated.' });
  } catch (err) {
    await conn.rollback();
    console.error('Error updating payment status:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
