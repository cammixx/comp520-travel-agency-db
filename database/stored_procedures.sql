DELIMITER $$

-- 1. Add Booking with Capacity Check
CREATE PROCEDURE sp_add_booking_with_capacity_check (
    IN p_customer_id INT,
    IN p_trip_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_insurance_id INT,
    IN p_total_price DECIMAL(10,2)
)
BEGIN
    DECLARE trip_cap INT;
    DECLARE booked_count INT;
    DECLARE confirmation_code VARCHAR(20);
    DECLARE new_booking_id INT;

    -- Step 1: Check capacity
    SELECT capacity INTO trip_cap FROM trip WHERE trip_id = p_trip_id;

    SELECT COUNT(*) INTO booked_count
    FROM booking
    WHERE trip_id = p_trip_id AND booking_status IN ('Confirmed', 'Completed');

    IF booked_count >= trip_cap THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add booking: trip is fully booked.';
    ELSE
        -- Step 2: Generate confirmation code
        SET confirmation_code = UPPER(CONCAT(
          SUBSTRING(MD5(RAND()), 1, 4),
          SUBSTRING(MD5(RAND()), 1, 4)
        ));

        -- Step 3: Insert booking using provided total price
        INSERT INTO booking (
            customer_id, trip_id, start_date, end_date,
            booking_status, total_price, confirmation_code
        )
        VALUES (
            p_customer_id, p_trip_id, p_start_date, p_end_date,
            'Pending', p_total_price, confirmation_code
        );

        SET new_booking_id = LAST_INSERT_ID();

        -- Step 4: Return booking info
        SELECT new_booking_id AS booking_id, confirmation_code, p_total_price AS total_price;
    END IF;
END$$
-- 2. Cancel Booking
CREATE PROCEDURE sp_cancel_booking(IN p_booking_id INT)
BEGIN
    UPDATE booking
    SET booking_status = 'Cancelled'
    WHERE booking_id = p_booking_id;
END$$

-- 3. Top 5 Most Booked Trips
CREATE PROCEDURE sp_top_booked_trips()
BEGIN
    SELECT 
        t.trip_id,
        t.trip_name,
        t.trip_type,
        t.duration,
        t.base_price,
        t.avg_rating,
        MIN(ht.price_per_night) AS min_hotel_price,
        (t.base_price + MIN(ht.price_per_night) * t.duration) AS total_price,
        COUNT(*) AS total_bookings
    FROM booking b
    JOIN trip t ON b.trip_id = t.trip_id
    LEFT JOIN hotel_trip ht ON t.trip_id = ht.trip_id
    WHERE b.booking_status IN ('Confirmed', 'Completed')
    GROUP BY t.trip_id
    ORDER BY total_bookings DESC
    LIMIT 5;
END$$


-- 4. Predict Affordable Packages Under Budget
CREATE PROCEDURE sp_affordable_trip_packages(IN p_budget DECIMAL(10,2))
BEGIN
    SELECT 
        t.trip_id,
        t.trip_name,
        t.trip_type,
        t.base_price AS estimated_total,
        (
            SELECT AVG(r.rating_score)
            FROM rating r
            JOIN booking b ON r.booking_id = b.booking_id
            WHERE b.trip_id = t.trip_id
        ) AS avg_rating
    FROM trip t
    GROUP BY t.trip_id
    HAVING estimated_total <= p_budget
    ORDER BY estimated_total ASC;
END$$

-- 5. Predict Cheapest Travel Days
CREATE PROCEDURE sp_predict_cheapest_travel_days()
BEGIN
    SELECT 
        t.trip_id,
        t.trip_name,
        t.trip_type,
        t.duration,
        t.base_price,
        t.avg_rating,
        MIN(ht.price_per_night) AS min_hotel_price,
        (t.base_price + MIN(ht.price_per_night) * t.duration) AS total_price
    FROM flight f
    JOIN trip t ON f.trip_id = t.trip_id
    JOIN hotel_trip ht ON t.trip_id = ht.trip_id
    GROUP BY t.trip_id
    ORDER BY total_price ASC
    LIMIT 5;
END$$

-- 6. Filter High-Rated Trips Only
CREATE PROCEDURE sp_filter_high_rated_trips(IN p_min_rating INT)
BEGIN
    SELECT 
        t.trip_id,
        t.trip_name,
        t.trip_type,
        t.duration,
        t.base_price,
        AVG(r.rating_score) AS avg_rating,
        MIN(ht.price_per_night) AS min_hotel_price,
        (t.base_price + MIN(ht.price_per_night) * t.duration) AS total_price
    FROM trip t
    JOIN booking b ON t.trip_id = b.trip_id
    JOIN rating r ON b.booking_id = r.booking_id
    JOIN hotel_trip ht ON t.trip_id = ht.trip_id
    GROUP BY t.trip_id
    HAVING avg_rating >= p_min_rating
    ORDER BY avg_rating DESC;
END$$

-- 7. Add Rating (after completed trip)
CREATE PROCEDURE sp_add_rating (
    IN p_customer_id INT,
    IN p_booking_id INT,
    IN p_score INT,
    IN p_feedback TEXT
)
BEGIN
    DECLARE trip_status VARCHAR(50);

    SELECT booking_status INTO trip_status
    FROM booking
    WHERE booking_id = p_booking_id AND customer_id = p_customer_id;

    IF trip_status <> 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot rate: Trip is not completed.';
    ELSE
        INSERT INTO rating (customer_id, booking_id, rating_score, feedback, rating_date)
        VALUES (p_customer_id, p_booking_id, p_score, p_feedback, CURDATE());
    END IF;
END$$

-- 8. Get rating distribution for a trip
CREATE PROCEDURE sp_get_rating_distribution(IN p_trip_id INT)
BEGIN
    SELECT
        r.rating_score,
        COUNT(*) AS total_ratings
    FROM rating r
    JOIN booking b ON r.booking_id = b.booking_id
    WHERE b.trip_id = p_trip_id
    GROUP BY r.rating_score
    ORDER BY r.rating_score DESC;
END$$


-- 9. Get Trip's Average Rating
CREATE PROCEDURE sp_get_trip_average_rating(IN p_trip_id INT)
BEGIN
    SELECT t.trip_name, AVG(r.rating_score) AS average_rating
    FROM trip t
    JOIN booking b ON t.trip_id = b.trip_id
    JOIN rating r ON b.booking_id = r.booking_id
    WHERE t.trip_id = p_trip_id
    GROUP BY t.trip_id;
END$$

-- 10. Get Customer's Total Spending
CREATE PROCEDURE sp_get_total_spent(IN p_customer_id INT)
BEGIN
    SELECT c.first_name, c.last_name, SUM(b.total_price) AS total_spent
    FROM customer c
    JOIN booking b ON c.customer_id = b.customer_id
    WHERE b.booking_status IN ('Confirmed', 'Completed') AND c.customer_id = p_customer_id
    GROUP BY c.customer_id;
END$$

-- 11. Manually Update Booking Status
CREATE PROCEDURE sp_update_booking_status(
    IN p_booking_id INT,
    IN p_new_status VARCHAR(50)
)
BEGIN
    UPDATE booking
    SET booking_status = p_new_status
    WHERE booking_id = p_booking_id;
END$$

-- 12. Get Trips by Type
CREATE PROCEDURE sp_get_trips_by_type(IN p_type VARCHAR(50))
BEGIN
  SELECT 
    t.trip_id,
    t.trip_name,
    t.trip_type,
    t.duration,
    t.base_price,
    AVG(r.rating_score) AS avg_rating,
    MIN(ht.price_per_night) AS min_hotel_price,
    (t.base_price + MIN(ht.price_per_night) * t.duration) AS total_price
  FROM trip t
  LEFT JOIN hotel_trip ht ON t.trip_id = ht.trip_id
  LEFT JOIN booking b ON t.trip_id = b.trip_id
  LEFT JOIN rating r ON b.booking_id = r.booking_id
  WHERE t.trip_type = p_type
  GROUP BY t.trip_id
  ORDER BY t.trip_name;
END$$

DELIMITER ;