from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import users_bp
from models import db
from models.user import User
from utils.security import donor_required, recipient_required

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    return jsonify({'user': user.to_dict(include_sensitive=True)}), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Обновление данных пользователя
    try:
        # Обновляем только разрешенные поля
        allowed_fields = [
            'first_name', 'last_name', 'patronymic', 'phone_number', 
            'address', 'blood_type', 'rh_factor', 'height', 'weight',
            'has_chronic_diseases', 'chronic_diseases_details'
        ]
        
        for field in allowed_fields:
            if field in data:
                # Преобразуем имена полей из camelCase в snake_case
                if field == 'first_name' and 'firstName' in data:
                    setattr(user, field, data['firstName'])
                elif field == 'last_name' and 'lastName' in data:
                    setattr(user, field, data['lastName'])
                elif field == 'phone_number' and 'phoneNumber' in data:
                    setattr(user, field, data['phoneNumber'])
                elif field == 'blood_type' and 'bloodType' in data:
                    setattr(user, field, data['bloodType'])
                elif field == 'rh_factor' and 'rhFactor' in data:
                    setattr(user, field, data['rhFactor'])
                elif field == 'has_chronic_diseases' and 'hasChronicDiseases' in data:
                    setattr(user, field, data['hasChronicDiseases'])
                elif field == 'chronic_diseases_details' and 'chronicDiseasesDetails' in data:
                    setattr(user, field, data['chronicDiseasesDetails'])
                else:
                    setattr(user, field, data.get(field))
        
        db.session.commit()
        
        return jsonify({
            'message': 'Профиль успешно обновлен',
            'user': user.to_dict(include_sensitive=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/donors', methods=['GET'])
@jwt_required()
def get_donors():
    """Получение списка доноров (для реципиентов)"""
    # Получение параметров фильтрации
    blood_type = request.args.get('blood_type')
    rh_factor = request.args.get('rh_factor')
    
    # Формирование базового запроса
    query = User.query.filter_by(role='donor')
    
    # Применение фильтров, если они указаны
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    if rh_factor:
        query = query.filter_by(rh_factor=rh_factor)
    
    # Выполнение запроса и получение результатов
    donors = query.all()
    
    # Преобразование результатов в формат JSON
    donors_data = [donor.to_dict() for donor in donors]
    
    return jsonify({'donors': donors_data}), 200

@users_bp.route('/recipients', methods=['GET'])
@jwt_required()
def get_recipients():
    """Получение списка реципиентов (для доноров)"""
    # Получение параметров фильтрации
    blood_type = request.args.get('blood_type')
    rh_factor = request.args.get('rh_factor')
    
    # Формирование базового запроса
    query = User.query.filter_by(role='recipient')
    
    # Применение фильтров, если они указаны
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    if rh_factor:
        query = query.filter_by(rh_factor=rh_factor)
    
    # Выполнение запроса и получение результатов
    recipients = query.all()
    
    # Преобразование результатов в формат JSON
    recipients_data = [recipient.to_dict() for recipient in recipients]
    
    return jsonify({'recipients': recipients_data}), 200

@users_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Проверка текущего пароля
    if not user.check_password(data.get('current_password')):
        return jsonify({'error': 'Неверный текущий пароль'}), 400
    
    # Проверка нового пароля
    new_password = data.get('new_password')
    if not new_password or len(new_password) < 6:
        return jsonify({'error': 'Новый пароль должен содержать минимум 6 символов'}), 400
    
    # Обновление пароля
    try:
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Пароль успешно изменен'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500