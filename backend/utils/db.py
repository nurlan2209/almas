from flask_sqlalchemy import SQLAlchemy
from models import db

def init_db(app):
    """Инициализация базы данных"""
    db.init_app(app)
    
    # Создание всех таблиц при запуске приложения
    with app.app_context():
        db.create_all()

def get_db():
    """Получение экземпляра базы данных"""
    return db