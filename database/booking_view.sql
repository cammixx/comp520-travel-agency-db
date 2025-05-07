-- 1. Shows all available trips, allowing customers to browse and search for trips in the "Trips" section of the GUI.
CREATE OR REPLACE VIEW view_trip_catalog AS
SELECT 
    t.trip_id,
    t.trip_name,
    t.trip_type,
    t.duration,
    t.base_price,
    t.description,
    t.capacity,
    COALESCE(t.capacity - b.booked_count, t.capacity) AS seats_available,
    ROUND(r.avg_rating, 1) AS avg_rating
FROM trip t
LEFT JOIN (
    SELECT 
        trip_id, 
        COUNT(*) AS booked_count
    FROM booking
    WHERE booking_status IN ('Confirmed', 'Completed')
    GROUP BY trip_id
) AS b ON t.trip_id = b.trip_id
LEFT JOIN (
    SELECT 
        b.trip_id, 
        AVG(r.rating_score) AS avg_rating
    FROM rating r
    JOIN booking b ON r.booking_id = b.booking_id
    GROUP BY b.trip_id
) AS r ON t.trip_id = r.trip_id
ORDER BY t.trip_name;

-- 2. Show customer reviews for trips
CREATE OR REPLACE VIEW view_customer_ratings AS
SELECT
    r.rating_id,
    c.first_name,
    c.last_name,
    t.trip_name,
    r.rating_score,
    r.feedback,
    r.rating_date
FROM rating r
JOIN booking b ON r.booking_id = b.booking_id
JOIN customer c ON b.customer_id = c.customer_id -- safer FK path
JOIN trip t ON b.trip_id = t.trip_id
ORDER BY r.rating_date DESC;

-- 3. Display available travel insurance tied to user bookings.
CREATE OR REPLACE VIEW view_available_insurance AS
SELECT
    c.first_name,
    c.last_name,
    b.booking_id,
    ti.provider_name,
    ti.coverage_details,
    ti.insurance_cost
FROM travel_insurance ti
JOIN booking b ON ti.booking_id = b.booking_id
JOIN customer c ON b.customer_id = c.customer_id
ORDER BY ti.insurance_cost DESC;

-- 4. Shows booking details by confirmation code
CREATE OR REPLACE VIEW view_booking_details AS
SELECT
    b.booking_id,
    b.confirmation_code,
    b.start_date,
    b.end_date,
    b.booking_status,

    -- Total price from booking only
    b.total_price AS total_price,

    -- Customer info
    c.customer_id,
    c.first_name,
    c.last_name,

    -- Trip info
    t.trip_name,
    t.trip_type,

    -- Destination from hotel location
    loc.city AS destination_city,
    loc.country AS destination_country,

    -- Flight info (if booked)
    f.airline_name,
    f.flight_number,
    f.departure_airport,
    f.arrival_airport,
    f.departure_datetime,
    f.arrival_datetime,

    -- Hotel info (if booked)
    h.name AS hotel_name,
    h.city AS hotel_city,
    h.country AS hotel_country

FROM booking b
JOIN customer c ON b.customer_id = c.customer_id
JOIN trip t ON b.trip_id = t.trip_id

-- Optional flight
LEFT JOIN booking_flight bf ON b.booking_id = bf.booking_id
LEFT JOIN flight f ON bf.flight_id = f.flight_id

-- Optional hotel
LEFT JOIN booking_hotel bh ON b.booking_id = bh.booking_id
LEFT JOIN hotel h ON bh.hotel_id = h.hotel_id
LEFT JOIN location loc ON h.location_id = loc.location_id;

-- 5. Shows available flights by trip
CREATE OR REPLACE VIEW view_available_flights_by_trip AS
SELECT
    f.flight_id,
    f.trip_id,
    t.trip_name,
    f.airline_name,
    f.flight_number,
    f.price AS flight_price,
    f.class AS flight_class
FROM flight f
JOIN trip t ON f.trip_id = t.trip_id
WHERE f.is_return = TRUE
ORDER BY t.trip_name, f.departure_datetime;
-- Shows available hotels by trip
CREATE OR REPLACE VIEW view_available_hotels_by_trip AS
SELECT
    ht.hotel_trip_id,
    ht.trip_id,
    t.trip_name,
    h.hotel_id,
    h.name AS hotel_name,
    h.city,
    h.country,
    h.star_rating,
    ht.room_type,
    ht.price_per_night
FROM hotel_trip ht
JOIN hotel h ON ht.hotel_id = h.hotel_id
JOIN trip t ON ht.trip_id = t.trip_id
ORDER BY t.trip_name, h.star_rating DESC;