CREATE DATABASE IF NOT EXISTS starwarsBD;

USE starwarsBD;

CREATE TABLE planets (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    name VARCHAR(255) NOT NULL,
    rotation_period VARCHAR(50),
    orbital_period VARCHAR(50),
    diameter VARCHAR(50),
    climate VARCHAR(255),
    gravity VARCHAR(255),
    terrain VARCHAR(255),
    surface_water VARCHAR(50),
    population VARCHAR(50),
    city_name VARCHAR(255),
    city_region VARCHAR(255),
    city_country VARCHAR(255),
    city_lat DECIMAL(10, 6),
    city_lon DECIMAL(10, 6),
    city_tz_id VARCHAR(255),
    city_temp_c DECIMAL(5, 2),
    city_temp_f DECIMAL(5, 2),
    city_humidity INT
);

CREATE TABLE people (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    name VARCHAR(255) NOT NULL,
    height VARCHAR(50),
    mass VARCHAR(50),
    hair_color VARCHAR(255),
    skin_color VARCHAR(255),
    eye_color VARCHAR(255),
    birth_year VARCHAR(50),
    gender VARCHAR(50),
    planet_id CHAR(36),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planet_id) REFERENCES planets (id) ON DELETE SET NULL
);
