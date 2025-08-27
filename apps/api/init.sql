-- Table: address
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255),
    state VARCHAR(100),
    number INT,
    city VARCHAR(100),
    cep VARCHAR(20),
    latitude FLOAT,
    longitude FLOAT,
    complement VARCHAR(255)
);

-- Table: owner
CREATE TABLE owner (
    id SERIAL PRIMARY KEY,
    id_address INT REFERENCES address(id),
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    entry_at DATE,
    phone_number VARCHAR(20),
    face_img BYTEA
);

-- Table: announcement
CREATE TABLE announcement (
    id SERIAL PRIMARY KEY,
    id_owner INT REFERENCES owner(id),
    id_address INT REFERENCES address(id),
    price NUMERIC(12,2),
    vacancies INT,
    max_people INT,
    description TEXT,
    title VARCHAR(255),
    images BYTEA,
    sex VARCHAR(20), -- could be ENUM later if desired
    created_at DATE,
    university VARCHAR(255)
);
