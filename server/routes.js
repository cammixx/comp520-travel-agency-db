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
    const [rows] = await pool.query('SELECT * FROM travel_insurance');
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
    const [rows] = await pool.query(
      `SELECT * FROM booking WHERE confirmation_code = ?`,
      [code]
    );

    if (rows.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }


    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, booking: rows[0] });
  } catch (err) {
    console.error('❌ Lookup failed:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ success: false, error: err && err.message ? err.message : 'Internal server error' });
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
router.post('/bookings', async (req, res) => {
  const pool = require('./db');
  const {
    tripId,
    startDate,
    endDate,
    insuranceId,
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


    // 2. Call stored procedure
    const [bookingResult] = await conn.query(
      `CALL sp_add_booking_with_capacity_check(?, ?, ?, ?, ?)`,
      [customerId, tripId, startDate, endDate, insuranceId || null]
    );


    const { booking_id, confirmation_code, total_price } = bookingResult[0][0];


    // 3. Link insurance to the booking (optional)
    if (insuranceId) {
      await conn.query(
        `INSERT INTO travel_insurance (booking_id, provider_name, coverage_details, insurance_cost)
         SELECT ?, provider_name, coverage_details, insurance_cost
         FROM travel_insurance_option
         WHERE insurance_id = ?`,
        [booking_id, insuranceId]
      );
    }


    await conn.commit();


    res.status(200).json({
      success: true,
      bookingId: booking_id,
      confirmationCode: confirmation_code,
      totalPrice: total_price
    });
  } catch (err) {
    await conn.rollback();
    console.error('Booking error:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});


// POST → adds a new rating for a booking
router.post('/rating', async (req, res) => {
  const { booking_id, rating_score, feedback } = req.body;
  try {
    const [result] = await pool.query(
      'CALL sp_add_rating(?, ?, ?)',
      [booking_id, rating_score, feedback]
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
// returns flights by trip ID
router.get('/hotels/by-trip/:tripId', async (req, res) => {
  const { tripId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM view_available_hotels_by_trip WHERE trip_id = ?`,
      [tripId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels for this trip' });
  }
});
// returns hotels by trip ID
router.get('/flights/by-trip/:tripId', async (req, res) => {
  const { tripId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM view_available_flights_by_trip WHERE trip_id = ?`, 
      [tripId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: 'Failed to fetch flights for this trip' });
  }
});
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

// returns affordable trip packages under a budget
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
router.get('/trips/cheapest-days', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_predict_cheapest_travel_days()');
    res.json(rows[0]); // unpack the result
  } catch (err) {
    console.error('Error fetching cheapest travel days:', err);
    res.status(500).json({ error: 'Failed to fetch cheapest travel days' });
  }
});

// returns booking details by confirmation code
router.get('/bookings/by-code/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM view_booking_details WHERE confirmation_code = ?`,
      [code]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No booking found.' });
    }
    res.json({ success: true, booking: rows[0] });
  } catch (err) {
    console.error('❌ Lookup failed:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
