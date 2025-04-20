from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from . import donations_bp
from models import db
from models.user import User
from models.donation import Donation
from models.donation_request import DonationRequest
from models.donation_center import DonationCenter
from utils.validators import validate_donation
from utils.security import donor_required

@donations_bp.route('', methods=['GET'])
@jwt_required()
def get_donations():
    """Получение списка донаций"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Получение параметров фильтрации
    status = request.args.get('status')
    
    # Получение донаций в зависимости от роли пользователя
    if user.role == 'donor':
        # Для донора показываем его донации
        query = Donation.query.filter_by(donor_id=user_id)
    else:
        # Для реципиента показываем донации, предназначенные для него
        query = Donation.query.filter_by(recipient_id=user_id)
    
    # Применение фильтров, если они указаны
    if status:
        query = query.filter_by(status=status)
    
    # Выполнение запроса и получение результатов
    donations = query.order_by(Donation.donation_date.desc() if Donation.donation_date else Donation.created_at.desc()).all()
    
    # Преобразование результатов в формат JSON
    donations_data = [donation.to_dict(
        include_donor=user.role == 'recipient',
        include_recipient=user.role == 'donor',
        include_center=True
    ) for donation in donations]
    
    return jsonify({'donations': donations_data}), 200

@donations_bp.route('/scheduled', methods=['GET'])
@jwt_required()
def get_scheduled_donations():
    """Получение списка запланированных донаций"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Получение запланированных донаций для пользователя
    if user.role == 'donor':
        donations = Donation.get_upcoming_donations(donor_id=user_id)
    else:
        # Для реципиентов показываем донации, предназначенные для них
        donations = Donation.query.filter_by(recipient_id=user_id, status='scheduled').all()
    
    # Преобразование результатов в формат JSON
    donations_data = [donation.to_dict(
        include_donor=user.role == 'recipient',
        include_recipient=user.role == 'donor',
        include_center=True
    ) for donation in donations]
    
    return jsonify({'donations': donations_data}), 200

@donations_bp.route('/<int:donation_id>', methods=['GET'])
@jwt_required()
def get_donation(donation_id):
    """Получение информации о конкретной донации"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск донации в базе данных
    donation = Donation.find_by_id(donation_id)
    
    if not donation:
        return jsonify({'error': 'Донация не найдена'}), 404
    
    # Проверка прав доступа
    if donation.donor_id != user_id and donation.recipient_id != user_id:
        return jsonify({'error': 'У вас нет прав на просмотр этой донации'}), 403
    
    # Определение роли пользователя
    user = User.find_by_id(user_id)
    
    return jsonify({
        'donation': donation.to_dict(
            include_donor=user.role == 'recipient',
            include_recipient=user.role == 'donor',
            include_center=True
        )
    }), 200

@donations_bp.route('', methods=['POST'])
@jwt_required()
@donor_required
def create_donation():
    """Создание новой донации"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск пользователя в базе данных
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    # Проверка роли пользователя
    if user.role != 'donor':
        return jsonify({'error': 'Только доноры могут создавать донации'}), 403
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Валидация входных данных
    errors = validate_donation(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    # Если указан центр донации, проверяем его существование
    donation_center_id = data.get('donation_center_id')
    if donation_center_id:
        center = DonationCenter.find_by_id(donation_center_id)
        if not center:
            return jsonify({'error': 'Центр донации не найден'}), 404
    
    # Если указан запрос на донацию, проверяем его существование и статус
    request_id = data.get('request_id')
    recipient_id = None
    
    if request_id:
        request_obj = DonationRequest.find_by_id(request_id)
        if not request_obj:
            return jsonify({'error': 'Запрос на донацию не найден'}), 404
        
        if request_obj.status != 'pending':
            return jsonify({'error': 'Запрос на донацию уже выполнен или отменен'}), 400
        
        # Проверка соответствия группы крови и резус-фактора
        if request_obj.blood_type != data['blood_type'] or request_obj.rh_factor != data['rh_factor']:
            return jsonify({'error': 'Группа крови и резус-фактор должны соответствовать запросу'}), 400
        
        recipient_id = request_obj.recipient_id
    
    # Обработка даты донации
    donation_date = None
    if data.get('donation_date'):
        try:
            donation_date = datetime.strptime(data['donation_date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Неверный формат даты донации'}), 400
    
    # Создание новой донации
    try:
        new_donation = Donation(
            donor_id=user_id,
            recipient_id=recipient_id,
            request_id=request_id,
            donation_date=donation_date,
            blood_type=data['blood_type'],
            rh_factor=data['rh_factor'],
            quantity=data['quantity'],
            donation_center_id=donation_center_id,
            status='scheduled'
        )
        
        db.session.add(new_donation)
        db.session.commit()
        
        return jsonify({
            'message': 'Донация успешно запланирована',
            'donation': new_donation.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/<int:donation_id>/complete', methods=['PUT'])
@jwt_required()
def complete_donation(donation_id):
    """Завершение донации"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск донации в базе данных
    donation = Donation.find_by_id(donation_id)
    
    if not donation:
        return jsonify({'error': 'Донация не найдена'}), 404
    
    # Проверка прав доступа (в будущем можно разрешить админам)
    if donation.donor_id != user_id:
        return jsonify({'error': 'У вас нет прав на завершение этой донации'}), 403
    
    # Проверка статуса донации
    if donation.status != 'scheduled':
        return jsonify({'error': 'Можно завершить только запланированные донации'}), 400
    
    # Завершение донации
    try:
        donation.update_status('completed')
        
        return jsonify({
            'message': 'Донация успешно завершена',
            'donation': donation.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/<int:donation_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_donation(donation_id):
    """Отмена донации"""
    # Получение ID пользователя из токена
    user_id = get_jwt_identity()
    
    # Поиск донации в базе данных
    donation = Donation.find_by_id(donation_id)
    
    if not donation:
        return jsonify({'error': 'Донация не найдена'}), 404
    
    # Проверка прав доступа
    if donation.donor_id != user_id:
        return jsonify({'error': 'У вас нет прав на отмену этой донации'}), 403
    
    # Проверка статуса донации
    if donation.status != 'scheduled':
        return jsonify({'error': 'Можно отменить только запланированные донации'}), 400
    
    # Отмена донации
    try:
        donation.update_status('canceled')
        
        return jsonify({
            'message': 'Донация успешно отменена',
            'donation': donation.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500