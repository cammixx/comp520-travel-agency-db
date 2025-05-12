USE travel_agency_db;

-- Insert locations
INSERT INTO location (city, country, region) VALUES
  ('New York', 'USA', 'NY'),
  ('Los Angeles', 'USA', 'CA'),
  ('Chicago', 'USA', 'IL'),
  ('Miami', 'USA', 'FL'),
  ('Seattle', 'USA', 'WA');

-- Insert customers
INSERT INTO customer (first_name, middle_name, last_name, email, phone) VALUES
  ('John', 'A', 'Smith', 'john.smith@example.com', '555-1001'),
  ('Mary', NULL, 'Johnson', 'mary.johnson@example.com', '555-1002'),
  ('Alice', 'C', 'Davis', 'alice.davis@example.com', '555-1003'),
  ('Bob', NULL, 'Miller', 'bob.miller@example.com', '555-1004'),
  ('Carol', 'E', 'Wilson', 'carol.wilson@example.com', '555-1005');

-- Insert trips
INSERT INTO trip (trip_name, description, duration, trip_type, base_price, capacity, avg_rating) VALUES
  ('NYC Explorer', 'Explore Manhattan landmarks', 4, 'City', 800.00, 25, 4.2),
  ('LA Getaway', 'Hollywood, beaches, nightlife', 5, 'City', 1200.00, 30, 4.5),
  ('Chicago Highlights', 'Architecture and museum tours', 3, 'City', 900.00, 20, 4.1),
  ('Miami Beach Fun', 'Sun, sand, and vibrant nightlife', 6, 'Beach', 1100.00, 15, 4.3),
  ('Seattle Adventure', 'Pike Place Market and outdoor hikes', 5, 'Adventure', 1000.00, 20, 4.0);

-- Insert bookings
INSERT INTO booking (customer_id, trip_id, start_date, end_date, booking_status, total_price, confirmation_code) VALUES
  (1, 1, '2025-06-01', '2025-06-05', 'Confirmed', 4000.00, 'ABC001'),
  (2, 2, '2025-07-10', '2025-07-17', 'Pending', 8400.00, 'ABC002'),
  (3, 3, '2025-08-15', '2025-08-18', 'Completed', 2700.00, 'ABC003'),
  (4, 4, '2025-09-05', '2025-09-11', 'Cancelled', 6600.00, 'ABC004'),
  (5, 5, '2025-10-20', '2025-10-25', 'Confirmed', 5000.00, 'ABC005');

-- Insert ratings
INSERT INTO rating (customer_id, booking_id, rating_score, feedback, rating_date) VALUES
  (1, 1, 5, 'Fantastic trip!', '2025-06-07'),
  (2, 2, 4, 'Very good, but hot', '2025-07-18'),
  (3, 3, 3, 'It was okay.', '2025-08-19'),
  (4, 4, 2, 'We were unhappy.', '2025-09-07'),
  (5, 5, 5, 'Loved every bit!', '2025-10-27');

-- Insert flights
INSERT INTO flight (trip_id, airline_name, flight_number, departure_airport, arrival_airport, departure_datetime, arrival_datetime, price, class, departure_location_id, arrival_location_id, seat_capacity, is_return) VALUES
  (1, 'Delta', 'DL100', 'JFK', 'ORD', '2025-06-01 09:00:00', '2025-06-01 11:00:00', 200.00, 'Economy', 1, 3, 150, 0),
  (2, 'American Airlines', 'AA200', 'LAX', 'MIA', '2025-07-10 10:00:00', '2025-07-10 18:00:00', 300.00, 'Economy', 2, 4, 200, 0),
  (3, 'United', 'UA300', 'ORD', 'SEA', '2025-08-15 08:00:00', '2025-08-15 11:30:00', 250.00, 'Economy', 3, 5, 180, 1),
  (4, 'Southwest', 'SW400', 'MIA', 'LAX', '2025-09-05 07:00:00', '2025-09-05 13:00:00', 280.00, 'Economy', 4, 2, 220, 1),
  (5, 'Alaska Airlines', 'AS500', 'SEA', 'JFK', '2025-10-20 12:00:00', '2025-10-20 20:00:00', 320.00, 'Economy', 5, 1, 160, 0);

-- Insert hotels
INSERT INTO hotel (name, address, city, country, star_rating, amenities, contact_info, location_id) VALUES
  ('NYC Grand Hotel', '123 Manhattan Ave', 'New York', 'USA', 5, 'WiFi,Pool,Gym', 'contact@nycgrand.com', 1),
  ('LA Sunset Inn', '456 Sunset Blvd', 'Los Angeles', 'USA', 4, 'WiFi,Breakfast', 'info@lasunset.com', 2),
  ('Chicago Comfort', '789 Lakes Dr', 'Chicago', 'USA', 3, 'WiFi', 'stay@chicagocomfort.com', 3),
  ('Miami Beach Hotel', '321 Ocean Dr', 'Miami', 'USA', 4, 'Beachfront,WiFi', 'book@miamibeach.com', 4),
  ('Seattle Central', '654 Pine St', 'Seattle', 'USA', 5, 'WiFi,Gym', 'reservations@seattlecentral.com', 5);

-- Insert hotel-trip relationships
INSERT INTO hotel_trip (hotel_id, trip_id, room_type, price_per_night, room_capacity) VALUES
  (1, 1, 'Deluxe', 300.00, 30),
  (2, 2, 'Standard', 150.00, 25),
  (3, 3, 'Suite', 200.00, 20),
  (4, 4, 'Ocean View', 350.00, 15),
  (5, 5, 'King', 250.00, 20);

-- Insert complaints
INSERT INTO complaint (rating_id, complaint_status, action_taken) VALUES
  (1, 'Pending', 'Customer contacted support'),
  (2, 'Resolved', 'Refund issued'),
  (3, 'In Review', 'Looking into it'),
  (4, 'Closed', 'No action needed'),
  (5, 'Resolved', 'Full refund processed');

-- Insert payments
INSERT INTO payment (booking_id, payment_method, payment_date, amount, payment_status) VALUES
  (1, 'Credit Card', '2025-05-20', 4000.00, 'Completed'),
  (2, 'PayPal', '2025-05-21', 8400.00, 'Pending'),
  (3, 'Bank Transfer', '2025-06-01', 2700.00, 'Completed'),
  (4, 'Credit Card', '2025-07-01', 6600.00, 'Failed'),
  (5, 'Debit Card', '2025-08-01', 5000.00, 'Completed');

-- Insert travel insurance options
INSERT INTO travel_insurance_option (provider_name, coverage_details, insurance_cost, is_active) VALUES
  ('Basic Plan', 'Medical only', 50.00, TRUE),
  ('Standard Plan', 'Medical + Luggage', 75.00, TRUE),
  ('Premium Plan', 'Full coverage', 100.00, TRUE),
  ('Gold Plan', 'Full coverage + Cancellation', 120.00, FALSE),
  ('Platinum Plan', 'All inclusive', 150.00, TRUE);

-- Insert travel insurance
INSERT INTO travel_insurance (booking_id, insurance_option_id, insurance_cost) VALUES
  (1, 1, 50.00),
  (2, 2, 75.00),
  (3, 3, 100.00),
  (4, 4, 120.00),
  (5, 5, 150.00);

-- Insert booking-hotel relationships
INSERT INTO booking_hotel (booking_id, hotel_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- Insert booking-flight relationships
INSERT INTO booking_flight (booking_id, flight_id, is_return) VALUES
  (1, 1, 0),
  (2, 2, 0),
  (3, 3, 1),
  (4, 4, 1),
  (5, 5, 0);