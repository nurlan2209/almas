-- Создание таблицы пользователей (users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    iin VARCHAR(20) UNIQUE,  -- Идентификационный номер
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    role VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'recipient', 'admin')),
    phone_number VARCHAR(20),
    address TEXT,
    blood_type VARCHAR(5),
    rh_factor VARCHAR(10) CHECK (rh_factor IN ('positive', 'negative')),
    height INTEGER,
    weight INTEGER,
    has_chronic_diseases BOOLEAN DEFAULT FALSE,
    chronic_diseases_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы центров донации (donation_centers)
CREATE TABLE IF NOT EXISTS donation_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    working_hours VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы запросов на донацию (donation_requests)
CREATE TABLE IF NOT EXISTS donation_requests (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    blood_type VARCHAR(5) NOT NULL,
    rh_factor VARCHAR(10) NOT NULL CHECK (rh_factor IN ('positive', 'negative')),
    quantity_needed INTEGER NOT NULL,
    urgency_level VARCHAR(20) NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'fulfilled', 'canceled')),
    hospital_name VARCHAR(255),
    hospital_address TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы донаций (donations)
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    request_id INTEGER REFERENCES donation_requests(id),
    donation_date TIMESTAMP WITH TIME ZONE,
    blood_type VARCHAR(5) NOT NULL,
    rh_factor VARCHAR(10) NOT NULL CHECK (rh_factor IN ('positive', 'negative')),
    quantity INTEGER NOT NULL,
    donation_center_id INTEGER REFERENCES donation_centers(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_blood_type_rh ON users(blood_type, rh_factor);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_recipient_id ON donations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_donation_requests_recipient_id ON donation_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Проверяем существование триггера для каждой таблицы
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_donation_centers_updated_at') THEN
        CREATE TRIGGER update_donation_centers_updated_at BEFORE UPDATE ON donation_centers
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_donation_requests_updated_at') THEN
        CREATE TRIGGER update_donation_requests_updated_at BEFORE UPDATE ON donation_requests
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_donations_updated_at') THEN
        CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Заполнение таблицы центров донации тестовыми данными (если таблица пуста)
INSERT INTO donation_centers (name, address, working_hours, phone)
SELECT * FROM (
    VALUES
    ('Центр крови ФМБА России', 'г. Москва, ул. Щукинская, д. 6, корп. 2', 'Пн-Пт: 8:30 - 14:00', '+7 (495) 122-20-13'),
    ('Городская станция переливания крови', 'г. Москва, ул. Бакинская, д. 31', 'Пн-Сб: 8:00 - 15:00', '+7 (495) 366-98-10'),
    ('НИИ Скорой помощи им. Склифосовского', 'г. Москва, Б. Сухаревская пл., д. 3', 'Пн-Пт: 9:00 - 13:00', '+7 (495) 680-41-54'),
    ('Центр крови им. О.К. Гаврилова', 'г. Москва, ул. Поликарпова, д. 14, корп. 2', 'Пн-Пт: 8:30 - 14:00', '+7 (495) 945-71-66'),
    ('Национальный медицинский центр гематологии', 'г. Москва, Новый Зыковский проезд, д. 4', 'Пн-Пт: 9:00 - 14:00', '+7 (495) 612-44-13'),
    ('Городская клиническая больница №52', 'г. Москва, ул. Пехотная, д. 3', 'Пн-Пт: 8:30 - 13:00', '+7 (499) 196-18-34')
) AS new_centers
WHERE NOT EXISTS (SELECT 1 FROM donation_centers LIMIT 1);