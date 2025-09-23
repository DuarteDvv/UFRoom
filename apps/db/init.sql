-- types enumerados
CREATE TYPE property_type AS ENUM ('kitnet', 'individual_room', 'shared_room');
CREATE TYPE announcement_status AS ENUM ('paused', 'rented', 'liberation', 'full', 'available');
CREATE TYPE sex_restrict AS ENUM ('male', 'female', 'both');


-- tabela: address
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


-- tabela: owner
CREATE TABLE owner (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  entry_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  phone VARCHAR(30),
  img_url VARCHAR(255),
  password VARCHAR(255)
);


-- tabela: announcement
CREATE TABLE announcement (
  id SERIAL PRIMARY KEY,
  id_owner INT NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
  id_address INT REFERENCES address(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  occupants INT DEFAULT 0 CHECK (occupants >= 0),
  max_occupants INT CHECK (max_occupants >= 0),
  description TEXT,
  type_of property_type,
  status announcement_status DEFAULT 'available',
  title VARCHAR(255) NOT NULL,
  sex_restriction sex_restrict DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  rules TEXT,
  CONSTRAINT occupants_le_max CHECK (max_occupants IS NULL OR occupants <= max_occupants)
);

CREATE INDEX idx_announcement_owner ON announcement(id_owner);
CREATE INDEX idx_announcement_price ON announcement(price);
CREATE INDEX idx_announcement_status ON announcement(status);
CREATE INDEX idx_announcement_type ON announcement(type_of);
CREATE INDEX idx_announcement_sex ON announcement(sex_restriction);


-- tabela: announcement_img
CREATE TABLE announcement_img (
  id SERIAL PRIMARY KEY,
  id_announcement INT NOT NULL REFERENCES announcement(id) ON DELETE CASCADE,
  img_url VARCHAR(255) NOT NULL,
  entry_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  order_idx INT DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  UNIQUE (id_announcement, img_url)
);

CREATE INDEX idx_announcement_img_announcement ON announcement_img(id_announcement);


-- tabela: university 
CREATE TABLE university (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(50),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6)
);

CREATE INDEX idx_university_name ON university(name);
CREATE INDEX idx_university_coordinates ON university(latitude, longitude);


-- tabela de relacionamento announcement <-> university
CREATE TABLE announcement_university (
  id SERIAL PRIMARY KEY,
  id_announcement INT NOT NULL REFERENCES announcement(id) ON DELETE CASCADE,
  id_university INT NOT NULL REFERENCES university(id) ON DELETE CASCADE,
  distance DOUBLE PRECISION, -- distância calculada se necessário
  UNIQUE (id_announcement, id_university)
);

CREATE INDEX idx_announcement_university_announcement ON announcement_university(id_announcement);
CREATE INDEX idx_announcement_university_university ON announcement_university(id_university);


-- trigger function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- attach trigger to tables that have updated_at
CREATE TRIGGER trg_owner_updated_at
BEFORE UPDATE ON owner
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_announcement_updated_at
BEFORE UPDATE ON announcement
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION fn_update_updated_at();
