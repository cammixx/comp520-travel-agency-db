DELIMITER $$

-- 1. Flag low ratings for review
CREATE TRIGGER trg_flag_low_rating
AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    IF NEW.rating_score < 3 THEN
        INSERT INTO complaint (rating_id, complaint_status, action_taken)
        VALUES (NEW.rating_id, 'Open', 'Auto-flagged by trigger');
    END IF;
END$$

-- 2. Prevent duplicate hotel bookings for the same customer
CREATE TRIGGER trg_prevent_duplicate_hotel_booking
BEFORE INSERT ON booking_hotel
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM booking_hotel bh
        JOIN booking b ON bh.booking_id = b.booking_id
        WHERE b.customer_id = (SELECT customer_id FROM booking WHERE booking_id = NEW.booking_id)
          AND bh.hotel_id = NEW.hotel_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer has already booked this hotel.';
    END IF;
END$$

-- 3. Update trip average rating after new rating is added
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