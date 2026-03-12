-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENTS
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INT,
    abha_id VARCHAR(14),
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(15)
);

-- DOCTORS
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(100),
    hospital VARCHAR(100)
);

-- PHARMACIES
CREATE TABLE pharmacies (
    id SERIAL PRIMARY KEY,
    user_id INT,
    location TEXT
);

-- APPOINTMENTS
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    status VARCHAR(50),
    scheduled_time TIMESTAMP
);

-- CONSULTATIONS
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    appointment_id INT,
    call_type VARCHAR(50),
    doctor_notes TEXT
);

-- MEDICINES
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

-- PHARMACY INVENTORY
CREATE TABLE pharmacy_inventory (
    id SERIAL PRIMARY KEY,
    pharmacy_id INT,
    medicine_id INT,
    stock INT,
    price NUMERIC
);

-- PRESCRIPTIONS
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    consultation_id INT,
    patient_id INT,
    pharmacy_id INT,
    medicine_name VARCHAR(255),
    dosage TEXT,
    instructions TEXT,
    status VARCHAR(50)
);

-- SYMPTOM LOGS
CREATE TABLE symptom_logs (
    id SERIAL PRIMARY KEY,
    patient_id INT,
    symptoms TEXT,
    triage_result VARCHAR(50)
);