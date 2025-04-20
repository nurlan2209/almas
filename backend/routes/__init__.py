from flask import Blueprint

# Создание Blueprint для каждого модуля маршрутов
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
users_bp = Blueprint('users', __name__, url_prefix='/api/users')
donations_bp = Blueprint('donations', __name__, url_prefix='/api/donations')
donation_centers_bp = Blueprint('donation_centers', __name__, url_prefix='/api/donation-centers')
donation_requests_bp = Blueprint('donation_requests', __name__, url_prefix='/api/donation-requests')

# Импорт маршрутов
from .auth import *
from .users import *
from .donations import *
from .donation_centers import *
from .donation_requests import *

def init_routes(app):
    """Регистрация всех Blueprint в приложении"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(donation_centers_bp)
    app.register_blueprint(donation_requests_bp)