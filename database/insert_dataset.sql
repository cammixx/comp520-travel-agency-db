-- The Below code is written in SQL and is used to insert data into the tables of a travel agency database
USE travel_agency_db;

-- Insert data into the location table
INSERT INTO location (city, country, region) VALUES
('New York', 'USA', 'North America'),
('Paris', 'France', 'Europe'),
('Tokyo', 'Japan', 'Asia'),
('Sydney', 'Australia', 'Oceania'),
('Cairo', 'Egypt', 'Africa'),
('Berlin', 'Germany', 'Europe'),
('Toronto', 'Canada', 'North America'),
('Rio de Janeiro', 'Brazil', 'South America'),
('Bangkok', 'Thailand', 'Asia'),
('Rome', 'Italy', 'Europe');

-- Insert data into the customer table
INSERT INTO customer (first_name, middle_name, last_name, email, phone) VALUES
('Alice', 'M.', 'Smith', 'alice.smith@example.com', '1234567890'),
('Bob', NULL, 'Johnson', 'bob.johnson@example.com', '2345678901'),
('Charlie', 'A.', 'Lee', 'charlie.lee@example.com', '3456789012'),
('Dana', NULL, 'Kim', 'dana.kim@example.com', '4567890123'),
('Evan', 'T.', 'Wright', 'evan.wright@example.com', '5678901234'),
('Fiona', NULL, 'Chen', 'fiona.chen@example.com', '6789012345'),
('George', 'R.', 'Singh', 'george.singh@example.com', '7890123456'),
('Hannah', 'E.', 'Patel', 'hannah.patel@example.com', '8901234567'),
('Ivan', NULL, 'Nguyen', 'ivan.nguyen@example.com', '9012345678'),
('Julia', 'L.', 'Martinez', 'julia.martinez@example.com', '0123456789');

-- Insert data into the trip table
INSERT INTO trip (trip_name, description, duration, trip_type, base_price) VALUES
('Paris Escape', 'Romantic city getaway in Paris', 5, 'Cultural', 1200.00),
('Tokyo Adventure', 'Explore tech and tradition in Tokyo', 7, 'Adventure', 1500.00),
('Sydney Sun', 'Beach and surf adventure', 6, 'Relaxation', 1300.00),
('Cairo History Tour', 'See the pyramids and museums', 4, 'Cultural', 1000.00),
('Rome Classics', 'Historical and culinary highlights', 5, 'Cultural', 1100.00),
('Bangkok Discovery', 'Markets and temples experience', 6, 'Cultural', 900.00),
('Berlin Modern Tour', 'Art and architecture in Berlin', 5, 'Cultural', 1150.00),
('Rio Carnival Trip', 'Carnival and beach fun', 7, 'Festival', 1400.00),
('Toronto Explorer', 'Nature and urban vibe combined', 5, 'Relaxation', 1250.00),
('New York Highlights', 'Shopping, food, and skyline', 6, 'Urban', 1350.00);

-- Insert data into the booking table
INSERT INTO booking (customer_id, trip_id, start_date, end_date, booking_status, total_price) VALUES
(1, 1, '2024-06-01', '2024-06-06', 'Confirmed', 1300.00),
(2, 2, '2024-06-10', '2024-06-17', 'Completed', 1550.00),
(3, 3, '2024-07-01', '2024-07-07', 'Pending', 1400.00),
(4, 4, '2024-06-15', '2024-06-19', 'Cancelled', 1000.00),
(5, 5, '2024-07-10', '2024-07-15', 'Confirmed', 1150.00),
(6, 6, '2024-06-20', '2024-06-26', 'Completed', 950.00),
(7, 7, '2024-08-01', '2024-08-06', 'Completed', 1200.00),
(8, 8, '2024-08-10', '2024-08-17', 'Pending', 1500.00),
(9, 9, '2024-09-01', '2024-09-06', 'Confirmed', 1300.00),
(10, 10, '2024-09-15', '2024-09-21', 'Completed', 1400.00);

-- Insert data into the rating table
INSERT INTO rating (customer_id, booking_id, rating_score, feedback, rating_date) VALUES
(2, 2, 5, 'Amazing experience!', '2024-06-18'),
(6, 6, 4, 'Great guides and itinerary.', '2024-06-27'),
(7, 7, 3, 'Decent trip but a bit rushed.', '2024-08-07'),
(10, 10, 2, 'Too crowded and disorganized.', '2024-09-22'),
(5, 5, 5, 'Loved every moment.', '2024-07-16'),
(1, 1, 4, 'Beautiful city and great food.', '2024-06-07'),
(3, 3, 1, 'Got sick and bad hotel.', '2024-07-08'),
(8, 8, 3, 'Nice but weather was bad.', '2024-08-18'),
(9, 9, 4, 'Good balance of activities.', '2024-09-07'),
(4, 4, 2, 'Trip got cancelled last minute.', '2024-06-20');

-- Insert data into the hotel table
INSERT INTO flight (
    trip_id, airline_name, flight_number, departure_airport, arrival_airport,
    departure_datetime, arrival_datetime, price, class, departure_location_id, arrival_location_id
) VALUES
(1, 'Air France', 'AF123', 'JFK', 'CDG', '2024-06-01 18:00:00', '2024-06-02 07:30:00', 700.00, 'Economy', 1, 2),
(2, 'ANA', 'NH456', 'LAX', 'HND', '2024-06-10 12:00:00', '2024-06-11 16:00:00', 850.00, 'Economy', 1, 3),
(3, 'Qantas', 'QF789', 'LAX', 'SYD', '2024-07-01 22:00:00', '2024-07-03 06:00:00', 900.00, 'Business', 1, 4),
(4, 'EgyptAir', 'MS101', 'JFK', 'CAI', '2024-06-15 10:00:00', '2024-06-16 05:00:00', 680.00, 'Economy', 1, 5),
(5, 'ITA Airways', 'AZ202', 'ORD', 'FCO', '2024-07-10 17:00:00', '2024-07-11 09:00:00', 720.00, 'First', 1, 10),
(6, 'Thai Airways', 'TG303', 'LAX', 'BKK', '2024-06-20 14:00:00', '2024-06-21 06:00:00', 650.00, 'Economy', 1, 9),
(7, 'Lufthansa', 'LH404', 'JFK', 'TXL', '2024-08-01 20:00:00', '2024-08-02 09:00:00', 780.00, 'Business', 1, 6),
(8, 'LATAM', 'LA909', 'MIA', 'GIG', '2024-08-10 23:00:00', '2024-08-11 09:00:00', 670.00, 'Economy', 1, 8),
(9, 'Air Canada', 'AC606', 'LAX', 'YYZ', '2024-09-01 07:00:00', '2024-09-01 14:00:00', 620.00, 'Economy', 1, 7),
(10, 'Delta', 'DL777', 'ORD', 'JFK', '2024-09-15 15:00:00', '2024-09-15 19:00:00', 400.00, 'Economy', 1, 1);

-- Insert data into the hotel table
INSERT INTO hotel (name, address, city, country, star_rating, amenities, contact_info, location_id) VALUES
('Hotel Parisienne', '12 Rue de Rivoli', 'Paris', 'France', 4, 'WiFi, Breakfast', 'contact@parisienne.fr', 2),
('Tokyo Central Inn', '5 Chiyoda', 'Tokyo', 'Japan', 5, 'WiFi, Spa, Gym', 'info@tokyoinn.jp', 3),
('Sydney Seaside Hotel', '100 Bondi Rd', 'Sydney', 'Australia', 4, 'Pool, WiFi, Bar', 'book@sydneyseaside.au', 4),
('Pyramid View Lodge', '1 Giza St', 'Cairo', 'Egypt', 3, 'Breakfast, Guide Service', 'stay@pyramidlodge.eg', 5),
('Rome Royal Hotel', 'Via Veneto 10', 'Rome', 'Italy', 4, 'WiFi, Rooftop Restaurant', 'reservations@romeroyal.it', 10),
('Bangkok Budget Inn', '888 Sukhumvit', 'Bangkok', 'Thailand', 3, 'WiFi, Shuttle', 'hello@bangkokbudget.th', 9),
('Berlin Comfort', '22 Mitte', 'Berlin', 'Germany', 4, 'WiFi, Bar', 'contact@berlincomfort.de', 6),
('Copacabana Suites', '123 Beachfront Ave', 'Rio de Janeiro', 'Brazil', 5, 'Pool, Beach Access', 'book@copasuites.br', 8),
('Toronto Retreat', '456 Queen St', 'Toronto', 'Canada', 4, 'Breakfast, Gym', 'info@torontoretreat.ca', 7),
('Times Square Hotel', '789 Broadway', 'New York', 'USA', 5, 'Gym, WiFi, Bar', 'info@timeshotel.us', 1);

-- Insert data into the hotel_trip table
INSERT INTO hotel_trip (hotel_id, trip_id, room_type, price_per_night) VALUES
(1, 1, 'Standard', 150.00),
(2, 2, 'Suite', 220.00),
(3, 3, 'Deluxe', 180.00),
(4, 4, 'Standard', 100.00),
(5, 5, 'Suite', 210.00),
(6, 6, 'Standard', 90.00),
(7, 7, 'Deluxe', 160.00),
(8, 8, 'Suite', 250.00),
(9, 9, 'Standard', 130.00),
(10, 10, 'Deluxe', 170.00);

-- Insert data into the payment table
INSERT INTO payment (booking_id, payment_method, payment_date, amount, payment_status) VALUES
(1, 'Credit Card', '2024-05-15', 1300.00, 'Completed'),
(2, 'PayPal', '2024-05-20', 1550.00, 'Completed'),
(3, 'Credit Card', '2024-06-01', 1400.00, 'Pending'),
(4, 'Credit Card', '2024-05-25', 1000.00, 'Refunded'),
(5, 'Bank Transfer', '2024-06-15', 1150.00, 'Completed'),
(6, 'Credit Card', '2024-06-10', 950.00, 'Completed'),
(7, 'PayPal', '2024-07-20', 1200.00, 'Completed'),
(8, 'Credit Card', '2024-07-30', 1500.00, 'Pending'),
(9, 'Bank Transfer', '2024-08-01', 1300.00, 'Completed'),
(10, 'Credit Card', '2024-08-15', 1400.00, 'Completed');

-- Insert data into the complaint table
INSERT INTO complaint (rating_id, complaint_status, action_taken) VALUES
(4, 'Open', 'Awaiting customer service review'),
(7, 'Resolved', 'Customer offered partial refund'),
(10, 'Open', 'Trip was cancelled by agency'),
(3, 'Resolved', 'Explained itinerary miscommunication'),
(8, 'Open', 'Weather compensation review started'),
(6, 'Resolved', 'Apologized and credited points'),
(1, 'Closed', 'No action needed'),
(5, 'Open', 'Issue with hotel amenities'),
(9, 'Resolved', 'Rebooked alternative option'),
(2, 'Closed', 'Positive review misfiled');

-- Insert data into the travel_insurance table
INSERT INTO travel_insurance (booking_id, provider_name, coverage_details, insurance_cost) VALUES
(1, 'TravelSafe', 'Medical + Luggage', 45.00),
(2, 'GlobalShield', 'Full coverage including COVID', 60.00),
(3, 'QuickTravel', 'Medical only', 30.00),
(4, 'TravelSafe', 'Medical + Trip Cancellation', 50.00),
(5, 'GlobalShield', 'Luggage and Cancellation', 55.00),
(6, 'QuickTravel', 'Basic Medical', 25.00),
(7, 'TravelSafe', 'Full Plan', 65.00),
(8, 'GlobalShield', 'Emergency only', 40.00),
(9, 'QuickTravel', 'Medical and Delays', 35.00),
(10, 'TravelSafe', 'Full Trip Cover', 70.00);

-- Insert data into the agent table
INSERT INTO agent (first_name, last_name, email, phone) VALUES
('Mia', 'Brown', 'mia.brown@travelco.com', '3216549870'),
('Leo', 'Davis', 'leo.davis@travelco.com', '4567893210'),
('Nina', 'Garcia', 'nina.garcia@travelco.com', '5678901234'),
('Tom', 'Wilson', 'tom.wilson@travelco.com', '6789012345'),
('Sara', 'Hughes', 'sara.hughes@travelco.com', '7890123456'),
('Ryan', 'Kumar', 'ryan.kumar@travelco.com', '8901234567'),
('Emma', 'Lopez', 'emma.lopez@travelco.com', '9012345678'),
('Daniel', 'Chen', 'daniel.chen@travelco.com', '0123456789'),
('Olivia', 'Smith', 'olivia.smith@travelco.com', '1234509876'),
('James', 'Nguyen', 'james.nguyen@travelco.com', '2345609871');

-- Link each booking to a hotel involved in the trip
INSERT INTO booking_hotel (booking_id, hotel_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);