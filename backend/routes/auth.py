from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime

from . import auth_bp
from models import db
from models.user import User
from utils.validators import validate_user_registration, validate_login

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)  # Отладка
    
    # Валидация входных данных
    errors = validate_user_registration(data)
    if errors:
        print("Validation errors:", errors)  # Отладка
        return jsonify({'errors': errors}), 400
    
    # Проверка, что пользователь с таким email не существует
    print("Checking email:", data['email'])  # Отладка
    if User.find_by_email(data['email']):
        return jsonify({'errors': {'email': 'Пользователь с таким email уже существует'}}), 400
    
    # Создание нового пользователя
    try:
        # Собираем дополнительные поля из запроса
        additional_fields = {
            'patronymic': data.get('patronymic'),
            'iin': data.get('iin'),
            'birth_date': datetime.strptime(data.get('birth_date'), '%Y-%m-%d').date() if data.get('birth_date') else None,
            'gender': data.get('gender'),
            'phone_number': data.get('phone_number'),
            'address': data.get('address'),
            'blood_type': data.get('blood_type'),
            'rh_factor': data.get('rh_factor'),
            'height': data.get('height'),
            'weight': data.get('weight'),
            'has_chronic_diseases': data.get('has_chronic_diseases', False),
            'chronic_diseases_details': data.get('chronic_diseases_details')
        }
        
        print("Creating user with data:", {
            'email': data['email'],
            'password': data['password'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'role': data['role'],
            **additional_fields
        })  # Отладка
        
        new_user = User(
            email=data['email'],
            password=data['password'],  # Передаем чистый пароль, set_password хеширует
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            **additional_fields
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Создание токена для нового пользователя
        access_token = create_access_token(
            identity=new_user.id,
            expires_delta=timedelta(days=1)
        )
        
        return jsonify({
            'message': 'Пользователь успешно зарегистрирован',
            'token': access_token,
            'user': new_user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print("Error during registration:", str(e))  # Отладка
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Валидация входных данных
    errors = validate_login(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    # Поиск пользователя в базе данных
    user = User.find_by_email(data['email'])
    
    # Проверка существования пользователя и правильности пароля
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Неверный email или пароль'}), 401
    
    # Создание токена для авторизованного пользователя
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    return jsonify({'user': user.to_dict()}), 200