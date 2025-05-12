CREATE DATABASE travel_agency_db;
USE travel_agency_db;

-- Drop in reverse dependency order
DROP TABLE IF EXISTS booking_flight;
DROP TABLE IF EXISTS booking_hotel;
DROP TABLE IF EXISTS travel_insurance_option;
DROP TABLE IF EXISTS travel_insurance;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS complaint;
DROP TABLE IF EXISTS hotel_trip;
DROP TABLE IF EXISTS hotel;
DROP TABLE IF EXISTS flight;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS trip;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS customer;

-- Customer Table
CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id)
);

-- Location Table
CREATE TABLE location (
    location_id INT AUTO_INCREMENT,
    city VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    PRIMARY KEY (location_id)
);

-- Trip Table
CREATE TABLE trip (
    trip_id INT AUTO_INCREMENT,
    trip_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT NOT NULL CHECK (duration > 0),
    trip_type VARCHAR(50),
    base_price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    avg_rating DECIMAL(3,2),
    PRIMARY KEY (trip_id)
);

-- Booking Table
CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT,
    customer_id INT,
    trip_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') NOT NULL,
    total_price DECIMAL(10, 2),
    confirmation_code VARCHAR(20) UNIQUE,
    INDEX idx_booking_dates (start_date, end_date),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_customer (customer_id),
    CHECK (end_date > start_date),
    PRIMARY KEY (booking_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE CASCADE
);

-- Rating Table
CREATE TABLE rating (
    rating_id INT AUTO_INCREMENT,
    customer_id INT,
    booking_id INT,
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5),
    feedback TEXT,
    rating_date DATE,
    INDEX idx_rating_booking (booking_id),
    PRIMARY KEY (rating_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);



-- Flight Table
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT,
    trip_id INT,
    airline_name VARCHAR(100) NOT NULL,
    flight_number VARCHAR(50) NOT NULL,
    departure_airport VARCHAR(100),
    arrival_airport VARCHAR(100),
    departure_datetime DATETIME,
    arrival_datetime DATETIME,
    price DECIMAL(10, 2),
    class VARCHAR(20),
    departure_location_id INT,
    arrival_location_id INT,
    seat_capacity INT NOT NULL DEFAULT 100,
    is_return BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the flight is a return flight
    INDEX idx_flight_dates (departure_datetime, arrival_datetime),
    INDEX idx_flight_departure (departure_location_id),
    INDEX idx_flight_arrival (arrival_location_id),
    PRIMARY KEY (flight_id),
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE SET NULL,
    FOREIGN KEY (departure_location_id) REFERENCES location(location_id),
    FOREIGN KEY (arrival_location_id) REFERENCES location(location_id)
);

UPDATE flight SET is_return = TRUE WHERE MOD(flight_id, 2) = 0;

-- Hotel Table
CREATE TABLE hotel (
    hotel_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(100),
    country VARCHAR(100),
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    amenities TEXT,
    contact_info VARCHAR(100),
    location_id INT,
    INDEX idx_hotel_location (city, country),
    PRIMARY KEY (hotel_id),
    FOREIGN KEY (location_id) REFERENCES location(location_id)
);

-- Hotel_Trip Junction Table
CREATE TABLE hotel_trip (
    hotel_trip_id INT AUTO_INCREMENT,
    hotel_id INT,
    trip_id INT,
    room_type VARCHAR(50),
    price_per_night DECIMAL(10, 2),
    room_capacity INT NOT NULL DEFAULT 50,
    PRIMARY KEY (hotel_trip_id),
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE CASCADE,
    UNIQUE (hotel_id, trip_id)
);

-- Complaint Table
CREATE TABLE complaint (
    complaint_id INT AUTO_INCREMENT,
    rating_id INT,
    complaint_status VARCHAR(50) NOT NULL,
    action_taken TEXT,
    PRIMARY KEY (complaint_id),
    FOREIGN KEY (rating_id) REFERENCES rating(rating_id) ON DELETE CASCADE
);

-- Payment Table
CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT,
    booking_id INT,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL,
    INDEX idx_payment_booking (booking_id),
    PRIMARY KEY (payment_id),
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

-- Travel Insurance Table
CREATE TABLE travel_insurance (
    insurance_id INT AUTO_INCREMENT,
    booking_id INT NOT NULL,
    insurance_option_id INT NOT NULL,
    insurance_cost DECIMAL(10, 2) NOT NULL,
    INDEX idx_insurance_booking (booking_id),
    PRIMARY KEY (insurance_id),
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (insurance_option_id) REFERENCES travel_insurance_option(insurance_option_id) ON DELETE RESTRICT
);

-- Travel Insurance Option Table
CREATE TABLE travel_insurance_option (
    insurance_option_id INT AUTO_INCREMENT,
    provider_name VARCHAR(100) NOT NULL,
    coverage_details TEXT,
    insurance_cost DECIMAL(10, 2) NOT NULL CHECK (insurance_cost >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (insurance_option_id)
);

-- Booking-Hotel Junction Table (Added to support trigger)
CREATE TABLE booking_hotel (
    booking_id INT,
    hotel_id INT,
    PRIMARY KEY (booking_id, hotel_id),
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE
);

-- Booking-Flight Junction Table
CREATE TABLE booking_flight (
  booking_flight_id INT AUTO_INCREMENT,
  booking_id INT NOT NULL,
  flight_id INT NOT NULL,
  is_return BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (booking_flight_id),
  FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
  FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE,
  UNIQUE (booking_id, flight_id)
);