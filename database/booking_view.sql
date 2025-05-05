-- Show a customer’s bookings with relevant trip info
CREATE OR REPLACE VIEW view_booking_summary AS
SELECT
    b.booking_id,
    c.first_name,
    c.last_name,
    t.trip_name,
    t.trip_type,
    b.start_date,
    b.end_date,
    b.booking_status,
    b.total_price
FROM booking b
JOIN customer c ON b.customer_id = c.customer_id
JOIN trip t ON b.trip_id = t.trip_id
ORDER BY b.start_date DESC;

-- Shows all available trips, allowing customers to browse and search for trips in the "Trips" section of the GUI.
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

-- Show customer reviews for trips
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

-- Display available travel insurance tied to user bookings.
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

-- Shows user's trip itinerary, including flight and hotel details, for confirmed or completed bookings.
CREATE OR REPLACE VIEW view_user_trip_itinerary AS
SELECT
    c.first_name,
    c.last_name,
    t.trip_name,
    GROUP_CONCAT(DISTINCT f.airline_name ORDER BY f.departure_datetime SEPARATOR ', ') AS airlines,
    GROUP_CONCAT(DISTINCT DATE_FORMAT(f.departure_datetime, '%Y-%m-%d %H:%i') SEPARATOR ', ') AS departure_times,
    GROUP_CONCAT(DISTINCT DATE_FORMAT(f.arrival_datetime, '%Y-%m-%d %H:%i') SEPARATOR ', ') AS arrival_times,
    GROUP_CONCAT(DISTINCT h.name SEPARATOR ', ') AS hotels,
    GROUP_CONCAT(DISTINCT h.city SEPARATOR ', ') AS hotel_cities,
    GROUP_CONCAT(DISTINCT h.country SEPARATOR ', ') AS hotel_countries
FROM booking b
JOIN customer c ON b.customer_id = c.customer_id
JOIN trip t ON b.trip_id = t.trip_id
LEFT JOIN flight f ON f.trip_id = t.trip_id
LEFT JOIN hotel_trip ht ON ht.trip_id = t.trip_id
LEFT JOIN hotel h ON ht.hotel_id = h.hotel_id
WHERE b.booking_status IN ('Confirmed', 'Completed')
GROUP BY b.booking_id, c.first_name, c.last_name, t.trip_name
ORDER BY b.start_date;