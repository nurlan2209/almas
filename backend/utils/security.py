from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from functools import wraps
from flask import jsonify

def hash_password(password):
    """Хеширование пароля"""
    return pbkdf2_sha256.hash(password)

def verify_password(password, hashed_password):
    """Проверка пароля"""
    return pbkdf2_sha256.verify(password, hashed_password)

def generate_token(user_id):
    """Генерация JWT токена"""
    return create_access_token(identity=user_id)

def donor_required(fn):
    """Декоратор для проверки, что пользователь является донором"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        from models.user import User
        
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user or user.role != 'donor':
            return jsonify({"message": "Требуется роль донора"}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper

def recipient_required(fn):
    """Декоратор для проверки, что пользователь является реципиентом"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        from models.user import User
        
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user or user.role != 'recipient':
            return jsonify({"message": "Требуется роль реципиента"}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper

def admin_required(fn):
    """Декоратор для проверки, что пользователь является администратором"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        from models.user import User
        
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        
        if not user or user.role != 'admin':
            return jsonify({"message": "Требуются права администратора"}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper