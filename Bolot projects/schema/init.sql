CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    holiday_date DATE NOT NULL,
    image_url VARCHAR(500)
);

-- Таблица песен
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    holiday_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    lyrics TEXT,
    video_url VARCHAR(500),
    CONSTRAINT fk_holiday FOREIGN KEY(holiday_id) 
        REFERENCES holidays(id) 
        ON DELETE CASCADE
);

-- Таблица танцев
CREATE TABLE IF NOT EXISTS dances (
    id SERIAL PRIMARY KEY,
    holiday_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    CONSTRAINT fk_holiday FOREIGN KEY(holiday_id) 
        REFERENCES holidays(id) 
        ON DELETE CASCADE
);