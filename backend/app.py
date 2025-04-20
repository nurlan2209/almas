from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import app_config
from models import db
from routes import init_routes
from utils.db import init_db

def create_app(config=app_config):
    """Создание и настройка экземпляра Flask приложения"""
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Настройка CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Настройка JWT
    jwt = JWTManager(app)
    
    # Настройка базы данных
    init_db(app)
    
    # Регистрация маршрутов
    init_routes(app)
    
    # Обработка ошибок
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.route('/')
    def index():
        return jsonify({'message': 'Donor API service is running'})
    
    return app

# Создание приложения
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)