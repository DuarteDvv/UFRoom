CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    number INT,
    city VARCHAR(100) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    complement VARCHAR(255)
);

CREATE INDEX idx_address_city ON address(city);
CREATE INDEX idx_address_state ON address(state);
CREATE INDEX idx_address_coordinates ON address(latitude, longitude);
CREATE INDEX idx_address_cep ON address(cep);

----------------------------------------------------------------------

CREATE TABLE owner (
    id SERIAL PRIMARY KEY,
    id_address INT REFERENCES address(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    entry_at DATE,
    phone_number VARCHAR(20),
    img_url VARCHAR(255) NOT NULL
);
CREATE INDEX idx_owner_address ON owner(id_address);

-----------------------------------------------------------------------

CREATE TYPE sex_enum AS ENUM ('male','female','other');

CREATE TABLE announcement (
    id SERIAL PRIMARY KEY,
    id_owner INT REFERENCES owner(id) ON DELETE CASCADE,
    id_address INT REFERENCES address(id) ON DELETE SET NULL,
    price NUMERIC(12,2) NOT NULL,
    vacancies INT,
    max_people INT,
    description TEXT,
    title VARCHAR(255) NOT NULL,
    sex sex_enum,
    created_at TIMESTAMP DEFAULT NOW(),
    university VARCHAR(255),
    rules VARCHAR(255)
);
CREATE INDEX idx_announcement_owner ON announcement(id_owner);
CREATE INDEX idx_announcement_price ON announcement(price);
CREATE INDEX idx_announcement_university ON announcement(university);
CREATE INDEX idx_announcement_sex ON announcement(sex);

-----------------------------------------------------------------------

CREATE TABLE announcement_img (
    id SERIAL PRIMARY KEY,
    id_announcement INT REFERENCES announcement(id) ON DELETE CASCADE,
    img_url VARCHAR(255) NOT NULL
);
CREATE INDEX idx_announcement_img_announcement ON announcement_img(id_announcement);
