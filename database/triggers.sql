DELIMITER $$

-- 1. Flag low ratings for review
DROP TRIGGER IF EXISTS trg_flag_low_rating;
CREATE TRIGGER trg_flag_low_rating
AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    IF NEW.rating_score < 3 THEN
        INSERT INTO complaint (rating_id, complaint_status, action_taken)
        VALUES (NEW.rating_id, 'Open', 'Auto-flagged by trigger');
    END IF;
END$$

-- 2. Prevent duplicate trip bookings for the same customer
DROP TRIGGER IF EXISTS trg_prevent_duplicate_trip_booking;
CREATE TRIGGER trg_prevent_duplicate_trip_booking
BEFORE INSERT ON booking
FOR EACH ROW
BEGIN
    DECLARE v_customer_id INT;
    DECLARE v_start_date DATE;
    DECLARE v_end_date DATE;

    SET v_customer_id = NEW.customer_id;
    SET v_start_date = NEW.start_date;
    SET v_end_date = NEW.end_date;

    -- Check if the customer already has a booking for the same trip with overlapping dates
    IF EXISTS (
        SELECT 1
        FROM booking b
        WHERE b.customer_id = v_customer_id
          AND b.trip_id = NEW.trip_id
          AND (
              b.start_date <= v_end_date AND b.end_date >= v_start_date
          )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer has already booked this trip with overlapping dates.';
    END IF;
END$$

-- 3. Update trip average rating after new rating is added
DROP TRIGGER IF EXISTS trg_update_trip_avg_rating;
CREATE TRIGGER trg_update_trip_avg_rating
AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    DECLARE v_trip_id INT;

    -- Get the trip ID from the booking associated with the new rating
    SELECT trip_id INTO v_trip_id
    FROM booking
    WHERE booking_id = NEW.booking_id;

    -- Update the trip's average rating
    UPDATE trip
    SET avg_rating = (
        SELECT AVG(r.rating_score)
        FROM rating r
        JOIN booking b ON r.booking_id = b.booking_id
        WHERE b.trip_id = v_trip_id
    )
    WHERE trip_id = v_trip_id;
END$$


DELIMITER ;