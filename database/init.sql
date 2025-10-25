-- Futuristic Bus Reservation System Database Schema
-- PostgreSQL initialization script

-- Create database if not exists (handled by Docker)
-- CREATE DATABASE bus_reservation;

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'PASSENGER' CHECK (role IN ('PASSENGER', 'ADMIN', 'OPERATOR', 'CONDUCTOR')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus Companies
CREATE TABLE IF NOT EXISTS bus_companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus Fleet
CREATE TABLE IF NOT EXISTS buses (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES bus_companies(id),
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50),
    capacity INTEGER NOT NULL,
    features JSONB DEFAULT '{}', -- WiFi, AC, etc.
    rfid_enabled BOOLEAN DEFAULT true,
    iot_sensors_enabled BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes
CREATE TABLE IF NOT EXISTS routes (
    id BIGSERIAL PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km DECIMAL(10,2),
    estimated_duration_minutes INTEGER,
    route_coordinates JSONB, -- GPS coordinates for route tracking
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    route_id BIGINT REFERENCES routes(id),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    price_per_seat DECIMAL(10,2) NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seat Configuration
CREATE TABLE IF NOT EXISTS seat_configurations (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    seat_number VARCHAR(10) NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'STANDARD' CHECK (seat_type IN ('STANDARD', 'PREMIUM', 'WINDOW', 'AISLE')),
    row_number INTEGER NOT NULL,
    column_number INTEGER NOT NULL,
    comfort_score DECIMAL(3,2) DEFAULT 1.00, -- 0.00 to 1.00
    health_status VARCHAR(20) DEFAULT 'HEALTHY' CHECK (health_status IN ('HEALTHY', 'MAINTENANCE', 'BROKEN')),
    pressure_sensor_id VARCHAR(50), -- IoT sensor ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bus_id, seat_number)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    schedule_id BIGINT REFERENCES schedules(id),
    seat_number VARCHAR(10) NOT NULL,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    rfid_ticket_id VARCHAR(50) UNIQUE, -- RFID tag ID
    qr_code VARCHAR(255), -- QR code for ticket
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE NOT NULL,
    boarding_status VARCHAR(20) DEFAULT 'NOT_BOARDED' CHECK (boarding_status IN ('NOT_BOARDED', 'BOARDED', 'MISSED')),
    boarding_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'STRIPE')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    stripe_payment_intent_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_date TIMESTAMP
);

-- IoT Telemetry Data
CREATE TABLE IF NOT EXISTS iot_telemetry (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    sensor_type VARCHAR(50) NOT NULL, -- temperature, humidity, vibration, pressure
    sensor_id VARCHAR(50) NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    location VARCHAR(50), -- seat_number, cabin, engine, etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- RFID Events
CREATE TABLE IF NOT EXISTS rfid_events (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    rfid_reader_id VARCHAR(50) NOT NULL,
    ticket_id VARCHAR(50) NOT NULL,
    passenger_id BIGINT REFERENCES users(id),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('BOARDING', 'ALIGHTING', 'SCAN_FAILED')),
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(50), -- boarding_gate, seat_location
    success BOOLEAN NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    recommendation_type VARCHAR(50) NOT NULL, -- seat_suggestion, route_optimization, etc.
    content JSONB NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.00,
    is_applied BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy Analytics
CREATE TABLE IF NOT EXISTS energy_analytics (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    trip_id VARCHAR(50) NOT NULL,
    driver_id BIGINT REFERENCES users(id),
    fuel_consumption DECIMAL(10,2), -- liters
    distance_km DECIMAL(10,2),
    green_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    efficiency_metrics JSONB DEFAULT '{}',
    trip_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost Items Tracking
CREATE TABLE IF NOT EXISTS lost_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    item_name VARCHAR(100) NOT NULL,
    rfid_tag_id VARCHAR(50) UNIQUE NOT NULL,
    last_seen_bus_id BIGINT REFERENCES buses(id),
    last_seen_location VARCHAR(100),
    last_seen_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'LOST' CHECK (status IN ('LOST', 'FOUND', 'RETURNED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rebook Tokens
CREATE TABLE IF NOT EXISTS rebook_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    token_value VARCHAR(100) UNIQUE NOT NULL,
    original_booking_id BIGINT REFERENCES bookings(id),
    token_amount DECIMAL(10,2) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_booking_id BIGINT REFERENCES bookings(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Seating Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    seat_preference VARCHAR(20) CHECK (seat_preference IN ('WINDOW', 'AISLE', 'FRONT', 'BACK')),
    comfort_level VARCHAR(20) CHECK (comfort_level IN ('BASIC', 'STANDARD', 'PREMIUM')),
    social_preference VARCHAR(20) CHECK (social_preference IN ('QUIET', 'SOCIAL', 'WORK', 'MIXED')),
    music_preference VARCHAR(20) CHECK (music_preference IN ('SILENCE', 'SOFT', 'MODERATE', 'LOUD')),
    temperature_preference VARCHAR(20) CHECK (temperature_preference IN ('COLD', 'COOL', 'MODERATE', 'WARM')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident Reports
CREATE TABLE IF NOT EXISTS incident_reports (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT REFERENCES buses(id),
    incident_type VARCHAR(50) NOT NULL, -- sudden_braking, abnormal_acceleration, etc.
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    sensor_data JSONB DEFAULT '{}',
    ai_confidence DECIMAL(3,2) DEFAULT 0.00,
    is_resolved BOOLEAN DEFAULT false,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_iot_telemetry_bus_id ON iot_telemetry(bus_id);
CREATE INDEX IF NOT EXISTS idx_iot_telemetry_timestamp ON iot_telemetry(timestamp);
CREATE INDEX IF NOT EXISTS idx_rfid_events_bus_id ON rfid_events(bus_id);
CREATE INDEX IF NOT EXISTS idx_rfid_events_ticket_id ON rfid_events(ticket_id);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_seat_configurations_bus_id ON seat_configurations(bus_id);

-- Insert sample data
INSERT INTO bus_companies (name, contact_email, contact_phone, address) VALUES
('Future Transit Co.', 'contact@futuretransit.com', '+1-555-0100', '123 Innovation Drive, Tech City'),
('Smart Bus Lines', 'info@smartbus.com', '+1-555-0101', '456 AI Avenue, Digital Valley'),
('Eco Transport Ltd.', 'hello@ecotransport.com', '+1-555-0102', '789 Green Street, Eco City');

INSERT INTO routes (origin, destination, distance_km, estimated_duration_minutes, route_coordinates) VALUES
('New York', 'Boston', 350.5, 240, '{"coordinates": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 42.3601, "lng": -71.0589}]}'),
('Los Angeles', 'San Francisco', 559.0, 360, '{"coordinates": [{"lat": 34.0522, "lng": -118.2437}, {"lat": 37.7749, "lng": -122.4194}]}'),
('Chicago', 'Detroit', 282.0, 180, '{"coordinates": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 42.3314, "lng": -83.0458}]}'),
('Miami', 'Orlando', 235.0, 150, '{"coordinates": [{"lat": 25.7617, "lng": -80.1918}, {"lat": 28.5383, "lng": -81.3792}]}');

INSERT INTO buses (company_id, bus_number, model, capacity, features, rfid_enabled, iot_sensors_enabled) VALUES
(1, 'FT-001', 'FutureBus Pro', 50, '{"wifi": true, "ac": true, "usb_ports": true, "entertainment": true}', true, true),
(1, 'FT-002', 'FutureBus Elite', 45, '{"wifi": true, "ac": true, "usb_ports": true, "entertainment": true, "premium_seats": true}', true, true),
(2, 'SB-001', 'SmartBus Connect', 55, '{"wifi": true, "ac": true, "charging_stations": true}', true, true),
(3, 'ET-001', 'EcoBus Hybrid', 48, '{"wifi": true, "ac": true, "eco_friendly": true}', true, true);

INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, price_per_seat, day_of_week) VALUES
(1, 1, '08:00:00', '12:00:00', 45.00, 1), -- Monday
(1, 1, '14:00:00', '18:00:00', 45.00, 1), -- Monday
(2, 2, '09:00:00', '15:00:00', 65.00, 2), -- Tuesday
(3, 3, '07:30:00', '10:30:00', 35.00, 3), -- Wednesday
(4, 4, '11:00:00', '13:30:00', 25.00, 4); -- Thursday

-- Insert seat configurations for each bus
INSERT INTO seat_configurations (bus_id, seat_number, seat_type, row_number, column_number, comfort_score, pressure_sensor_id)
SELECT 
    b.id,
    CONCAT(r.row_num, CASE WHEN c.col_num = 1 THEN 'A' WHEN c.col_num = 2 THEN 'B' WHEN c.col_num = 3 THEN 'C' WHEN c.col_num = 4 THEN 'D' END),
    CASE 
        WHEN c.col_num IN (1, 4) THEN 'WINDOW'
        WHEN c.col_num IN (2, 3) THEN 'AISLE'
        ELSE 'STANDARD'
    END,
    r.row_num,
    c.col_num,
    CASE 
        WHEN r.row_num <= 5 THEN 1.00
        WHEN r.row_num <= 10 THEN 0.95
        ELSE 0.90
    END,
    CONCAT('SENSOR_', b.id, '_', r.row_num, '_', c.col_num)
FROM buses b
CROSS JOIN generate_series(1, CASE WHEN b.capacity <= 50 THEN 12 ELSE 14 END) AS r(row_num)
CROSS JOIN generate_series(1, CASE WHEN b.capacity <= 50 THEN 4 ELSE 4 END) AS c(col_num)
WHERE (r.row_num - 1) * 4 + c.col_num <= b.capacity;

-- Insert sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role) VALUES
('admin', 'admin@futuretransit.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin', 'User', '+1-555-0001', 'ADMIN'),
('operator1', 'operator1@futuretransit.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'John', 'Operator', '+1-555-0002', 'OPERATOR'),
('conductor1', 'conductor1@futuretransit.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Jane', 'Conductor', '+1-555-0003', 'CONDUCTOR'),
('passenger1', 'passenger1@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Alice', 'Smith', '+1-555-0004', 'PASSENGER'),
('passenger2', 'passenger2@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Bob', 'Johnson', '+1-555-0005', 'PASSENGER');

-- Insert user preferences
INSERT INTO user_preferences (user_id, seat_preference, comfort_level, social_preference, music_preference, temperature_preference) VALUES
(4, 'WINDOW', 'STANDARD', 'QUIET', 'SOFT', 'MODERATE'),
(5, 'AISLE', 'PREMIUM', 'SOCIAL', 'MODERATE', 'COOL');

COMMIT;

