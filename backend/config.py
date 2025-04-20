import os
from dotenv import load_dotenv

# Загрузка переменных окружения из .env файла
load_dotenv()

class Config:
    # Настройки приложения
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-this-to-a-secure-secret')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    
    # Настройки базы данных
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://postgres:1234@localhost:5432/donor_app')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Настройки JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-this-to-a-secure-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24  # 24 часа в секундах
    
    # Настройки CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Настройки паролей
    PASSWORD_SALT = os.getenv('PASSWORD_SALT', 'change-this-to-a-secure-salt')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    DATABASE_URI = os.getenv('TEST_DATABASE_URI', 'postgresql://postgres:1234@localhost:5432/donor_app_test')

# Выбор конфигурации в зависимости от окружения
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

app_config = config[os.getenv('FLASK_ENV', 'default')]