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

-- 4. Validate round trip flight selection
CREATE TRIGGER trg_validate_round_trip_flight
BEFORE INSERT ON booking_flight
FOR EACH ROW
BEGIN
  DECLARE existing_arrival INT;

  -- Get the arrival location of the existing flight
  SELECT f.arrival_location_id INTO existing_arrival
  FROM booking_flight bf
  JOIN flight f ON bf.flight_id = f.flight_id
  WHERE bf.booking_id = NEW.booking_id
  LIMIT 1;

  -- Check if departure of new flight matches arrival of existing
  IF existing_arrival IS NOT NULL THEN
    IF (SELECT departure_location_id FROM flight WHERE flight_id = NEW.flight_id) != existing_arrival THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Return flight must depart from the city you arrived in.';
    END IF;
  END IF;
END$$


DELIMITER ;