import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv
from passlib.hash import pbkdf2_sha256

# Загружаем переменные окружения
load_dotenv()

# Получаем строку подключения к базе данных из .env
DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://postgres:1234@localhost:5432/donor_app')

# Разбираем строку подключения
uri_parts = DATABASE_URI.split('/')
db_name = uri_parts[-1]
conn_parts = '/'.join(uri_parts[:-1]).split('@')
auth_parts = conn_parts[0].split(':')
username = auth_parts[1][2:]  # Удаляем // из начала имени пользователя
password = auth_parts[2]
host_port = conn_parts[1].split(':')
host = host_port[0]
port = host_port[1] if len(host_port) > 1 else '5432'

def create_database():
    """Создание базы данных, если она не существует"""
    try:
        # Подключаемся к стандартной базе данных postgres
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database='postgres'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Проверяем существование базы данных
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
        if cursor.fetchone() is None:
            # Создаем базу данных
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"База данных {db_name} создана.")
        else:
            print(f"База данных {db_name} уже существует.")
        
        cursor.close()
        conn.close()
        
        # Подключаемся к созданной базе данных
        conn = psycopg2.connect(DATABASE_URI)
        cursor = conn.cursor()
        
        # Загружаем SQL скрипт для создания таблиц
        with open('database_schema.sql', 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        # Выполняем SQL скрипт
        cursor.execute(sql_script)
        conn.commit()
        
        print("Таблицы успешно созданы.")
        
        # Создаем тестовых пользователей
        create_test_data(conn)
        
        cursor.close()
        conn.close()
        
        print("Инициализация базы данных завершена.")
        
    except Exception as e:
        print(f"Ошибка при создании базы данных: {e}")

def create_test_data(conn):
    """Создание тестовых данных"""
    cursor = conn.cursor()
    
    try:
        # Проверяем, есть ли уже пользователи в базе
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        if count > 0:
            print("Тестовые данные уже существуют.")
            return
        
        # Создаем тестовых пользователей (донора, реципиента и администратора)
        
        # Донор
        donor_password_hash = pbkdf2_sha256.hash("donor123")
        cursor.execute("""
            INSERT INTO users (
                email, password_hash, first_name, last_name, patronymic,
                iin, birth_date, gender, role, phone_number, address,
                blood_type, rh_factor, height, weight, has_chronic_diseases
            ) VALUES (
                'donor@example.com', %s, 'Иван', 'Петров', 'Сергеевич',
                '123456789012', '1990-01-01', 'male', 'donor', '+7 (777) 123-45-67',
                'г. Москва, ул. Примерная, д. 1, кв. 1',
                'II', 'positive', 180, 80, FALSE
            )
        """, (donor_password_hash,))
        
        # Реципиент
        recipient_password_hash = pbkdf2_sha256.hash("recipient123")
        cursor.execute("""
            INSERT INTO users (
                email, password_hash, first_name, last_name, patronymic,
                iin, birth_date, gender, role, phone_number, address,
                blood_type, rh_factor, height, weight, has_chronic_diseases
            ) VALUES (
                'recipient@example.com', %s, 'Мария', 'Иванова', 'Александровна',
                '987654321098', '1995-05-15', 'female', 'recipient', '+7 (777) 765-43-21',
                'г. Москва, ул. Донорская, д. 2, кв. 10',
                'I', 'negative', 165, 60, FALSE
            )
        """, (recipient_password_hash,))
        
        # Администратор
        admin_password_hash = pbkdf2_sha256.hash("admin123")
        cursor.execute("""
            INSERT INTO users (
                email, password_hash, first_name, last_name, patronymic,
                iin, birth_date, gender, role, phone_number, address
            ) VALUES (
                'admin@example.com', %s, 'Админ', 'Админов', 'Админович',
                '111222333444', '1985-10-10', 'male', 'admin', '+7 (777) 888-99-00',
                'г. Москва, ул. Администраторская, д. 1'
            )
        """, (admin_password_hash,))
        
        # Создаем тестовый запрос на донацию
        cursor.execute("""
            INSERT INTO donation_requests (
                recipient_id, blood_type, rh_factor, quantity_needed,
                urgency_level, status, hospital_name, hospital_address, description
            ) VALUES (
                (SELECT id FROM users WHERE email = 'recipient@example.com'),
                'I', 'negative', 450, 'high', 'pending',
                'Городская клиническая больница №52', 'г. Москва, ул. Пехотная, д. 3',
                'Требуется кровь для планового оперативного вмешательства'
            )
        """)
        
        conn.commit()
        print("Тестовые данные успешно созданы.")
        
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при создании тестовых данных: {e}")
    
    finally:
        cursor.close()

if __name__ == '__main__':
    create_database()