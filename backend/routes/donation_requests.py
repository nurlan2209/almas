from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import donation_requests_bp
from models import db
from models.user import User
from models.donation_request import DonationRequest
from utils.validators import validate_donation_request
from utils.security import recipient_required

@donation_requests_bp.route('', methods=['GET'])
@jwt_required()
def get_donation_requests():
    """Получение списка запросов на донацию"""
    # Получение параметров фильтрации
    status = request.args.get('status', 'pending')
    blood_type = request.args.get('blood_type')
    rh_factor = request.args.get('rh_factor')
    
    # Формирование базового запроса
    query = DonationRequest.query.filter_by(status=status)
    
    # Применение фильтров, если они указаны
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    if rh_factor:
        query = query.filter_by(rh_factor=rh_factor)
    
    # Выполнение запроса и получение результатов
    requests = query.order_by(DonationRequest.urgency_level.desc(), DonationRequest.created_at.desc()).all()
    
    # Преобразование результатов в формат JSON
    requests_data = [req.to_dict(include_recipient=True) for req in requests]
    
    return jsonify({'requests': requests_data}), 200

@donation_requests_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_requests():
    """Получение списка запросов на донацию текущего пользователя"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Получение параметров фильтрации
    status = request.args.get('status')
    
    # Формирование базового запроса
    query = DonationRequest.query.filter_by(recipient_id=user_id)
    
    # Применение фильтров, если они указаны
    if status:
        query = query.filter_by(status=status)
    
    # Выполнение запроса и получение результатов
    requests = query.order_by(DonationRequest.created_at.desc()).all()
    
    # Преобразование результатов в формат JSON
    requests_data = [req.to_dict() for req in requests]
    
    return jsonify({'requests': requests_data}), 200

@donation_requests_bp.route('/<int:request_id>', methods=['GET'])
@jwt_required()
def get_request(request_id):
    """Получение информации о конкретном запросе на донацию"""
    request = DonationRequest.find_by_id(request_id)
    
    if not request:
        return jsonify({'error': 'Запрос на донацию не найден'}), 404
    
    return jsonify({'request': request.to_dict(include_recipient=True)}), 200

@donation_requests_bp.route('', methods=['POST'])
@jwt_required()
@recipient_required
def create_request():
    """Создание нового запроса на донацию"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Проверка роли пользователя
    if user.role != 'recipient':
        return jsonify({'error': 'Только реципиенты могут создавать запросы на донацию'}), 403
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Валидация входных данных
    errors = validate_donation_request(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    # Создание нового запроса
    try:
        new_request = DonationRequest(
            recipient_id=user_id,
            blood_type=data['blood_type'],
            rh_factor=data['rh_factor'],
            quantity_needed=data['quantity_needed'],
            urgency_level=data['urgency_level'],
            hospital_name=data.get('hospital_name'),
            hospital_address=data.get('hospital_address'),
            description=data.get('description')
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        return jsonify({
            'message': 'Запрос на донацию успешно создан',
            'request': new_request.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donation_requests_bp.route('/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_request(request_id):
    """Обновление информации о запросе на донацию"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск запроса в базе данных
    request_obj = DonationRequest.find_by_id(request_id)
    
    if not request_obj:
        return jsonify({'error': 'Запрос на донацию не найден'}), 404
    
    # Проверка прав доступа
    if request_obj.recipient_id != user_id:
        return jsonify({'error': 'У вас нет прав на редактирование этого запроса'}), 403
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Проверка статуса запроса
    if request_obj.status != 'pending':
        return jsonify({'error': 'Можно редактировать только ожидающие запросы'}), 400
    
    # Обновление данных запроса
    try:
        # Обновляем только разрешенные поля
        allowed_fields = [
            'urgency_level', 'hospital_name', 'hospital_address', 'description'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(request_obj, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Запрос на донацию успешно обновлен',
            'request': request_obj.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donation_requests_bp.route('/<int:request_id>', methods=['DELETE'])
@jwt_required()
def cancel_request(request_id):
    """Отмена запроса на донацию"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск запроса в базе данных
    request_obj = DonationRequest.find_by_id(request_id)
    
    if not request_obj:
        return jsonify({'error': 'Запрос на донацию не найден'}), 404
    
    # Проверка прав доступа
    if request_obj.recipient_id != user_id:
        return jsonify({'error': 'У вас нет прав на отмену этого запроса'}), 403
    
    # Проверка статуса запроса
    if request_obj.status != 'pending':
        return jsonify({'error': 'Можно отменить только ожидающие запросы'}), 400
    
    # Отмена запроса
    try:
        request_obj.status = 'canceled'
        db.session.commit()
        
        return jsonify({
            'message': 'Запрос на донацию успешно отменен',
            'request': request_obj.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500