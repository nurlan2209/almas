from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db
from models.user import User
from models.donation import Donation
from models.donation_request import DonationRequest
from models.donation_center import DonationCenter
from utils.security import admin_required
from passlib.hash import pbkdf2_sha256

# Создание Blueprint для административных маршрутов
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ---------------------- Управление пользователями ---------------------- #

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    """Получение списка всех пользователей"""
    # Получение параметров запроса
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)  # Максимум 100 записей на страницу
    role = request.args.get('role')
    search = request.args.get('search')
    
    # Базовый запрос
    query = User.query
    
    # Применение фильтров
    if role:
        query = query.filter_by(role=role)
    
    if search:
        query = query.filter(
            (User.email.ilike(f'%{search}%')) |
            (User.first_name.ilike(f'%{search}%')) |
            (User.last_name.ilike(f'%{search}%')) |
            (User.phone_number.ilike(f'%{search}%'))
        )
    
    # Выполнение пагинированного запроса
    users_page = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Подготовка ответа
    return jsonify({
        'users': [user.to_dict() for user in users_page.items],
        'total': users_page.total,
        'pages': users_page.pages,
        'page': users_page.page
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_user(user_id):
    """Получение информации о конкретном пользователе"""
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    return jsonify({'user': user.to_dict(include_sensitive=True)}), 200

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@admin_required
def create_user():
    """Создание нового пользователя"""
    data = request.get_json()
    
    # Проверка уникальности email
    if User.find_by_email(data.get('email')):
        return jsonify({'error': 'Пользователь с таким email уже существует'}), 400
    
    try:
        # Хеширование пароля
        password_hash = pbkdf2_sha256.hash(data.get('password', 'password123'))
        
        # Создание нового пользователя
        new_user = User(
            email=data.get('email'),
            password_hash=password_hash,
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            role=data.get('role', 'donor'),
            patronymic=data.get('patronymic'),
            iin=data.get('iin'),
            birth_date=data.get('birth_date'),
            gender=data.get('gender'),
            phone_number=data.get('phone_number'),
            address=data.get('address'),
            blood_type=data.get('blood_type'),
            rh_factor=data.get('rh_factor'),
            height=data.get('height'),
            weight=data.get('weight'),
            has_chronic_diseases=data.get('has_chronic_diseases', False),
            chronic_diseases_details=data.get('chronic_diseases_details')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Пользователь успешно создан',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    """Обновление информации о пользователе"""
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    data = request.get_json()
    
    try:
        # Обновление основных данных
        if 'email' in data:
            # Проверка, не занят ли email другим пользователем
            existing = User.find_by_email(data['email'])
            if existing and existing.id != user_id:
                return jsonify({'error': 'Email уже используется другим пользователем'}), 400
            user.email = data['email']
        
        # Обновление пароля, если он предоставлен
        if 'password' in data and data['password']:
            user.password_hash = pbkdf2_sha256.hash(data['password'])
        
        # Обновление остальных полей
        fields = [
            'first_name', 'last_name', 'patronymic', 'role', 'iin', 'birth_date',
            'gender', 'phone_number', 'address', 'blood_type', 'rh_factor',
            'height', 'weight', 'has_chronic_diseases', 'chronic_diseases_details'
        ]
        
        for field in fields:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Пользователь успешно обновлен',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    """Удаление пользователя"""
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'message': 'Пользователь успешно удален'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ---------------------- Управление запросами на донацию ---------------------- #

@admin_bp.route('/donation-requests', methods=['GET'])
@jwt_required()
@admin_required
def get_all_requests():
    """Получение списка всех запросов на донацию"""
    # Получение параметров запроса
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    status = request.args.get('status')
    blood_type = request.args.get('blood_type')
    rh_factor = request.args.get('rh_factor')
    urgency = request.args.get('urgency_level')
    
    # Базовый запрос
    query = DonationRequest.query
    
    # Применение фильтров
    if status:
        query = query.filter_by(status=status)
    
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    if rh_factor:
        query = query.filter_by(rh_factor=rh_factor)
    
    if urgency:
        query = query.filter_by(urgency_level=urgency)
    
    # Сортировка по умолчанию - сначала по уровню срочности, затем по дате создания
    query = query.order_by(DonationRequest.urgency_level.desc(), DonationRequest.created_at.desc())
    
    # Выполнение пагинированного запроса
    requests_page = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Подготовка ответа
    return jsonify({
        'requests': [req.to_dict(include_recipient=True) for req in requests_page.items],
        'total': requests_page.total,
        'pages': requests_page.pages,
        'page': requests_page.page
    }), 200

@admin_bp.route('/donation-requests/<int:request_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_request_status(request_id):
    """Обновление статуса запроса на донацию"""
    request_obj = DonationRequest.find_by_id(request_id)
    
    if not request_obj:
        return jsonify({'error': 'Запрос на донацию не найден'}), 404
    
    data = request.get_json()
    
    try:
        # Обновление статуса запроса
        if 'status' in data:
            request_obj.status = data['status']
        
        # Обновление других полей запроса
        fields = ['urgency_level', 'hospital_name', 'hospital_address', 'description']
        
        for field in fields:
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

# ---------------------- Управление донациями ---------------------- #

@admin_bp.route('/donations', methods=['GET'])
@jwt_required()
@admin_required
def get_all_donations():
    """Получение списка всех донаций"""
    # Получение параметров запроса
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    status = request.args.get('status')
    blood_type = request.args.get('blood_type')
    rh_factor = request.args.get('rh_factor')
    
    # Базовый запрос
    query = Donation.query
    
    # Применение фильтров
    if status:
        query = query.filter_by(status=status)
    
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    if rh_factor:
        query = query.filter_by(rh_factor=rh_factor)
    
    # Сортировка по умолчанию - по дате донации и дате создания
    query = query.order_by(Donation.donation_date.desc(), Donation.created_at.desc())
    
    # Выполнение пагинированного запроса
    donations_page = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Подготовка ответа
    return jsonify({
        'donations': [
            donation.to_dict(include_donor=True, include_recipient=True, include_center=True) 
            for donation in donations_page.items
        ],
        'total': donations_page.total,
        'pages': donations_page.pages,
        'page': donations_page.page
    }), 200

@admin_bp.route('/donations/<int:donation_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_donation(donation_id):
    """Обновление информации о донации"""
    donation = Donation.find_by_id(donation_id)
    
    if not donation:
        return jsonify({'error': 'Донация не найдена'}), 404
    
    data = request.get_json()
    
    try:
        # Обновление статуса донации
        if 'status' in data:
            donation.status = data['status']
        
        # Обновление других полей донации
        fields = ['donation_date', 'blood_type', 'rh_factor', 'quantity', 'donation_center_id']
        
        for field in fields:
            if field in data:
                setattr(donation, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Донация успешно обновлена',
            'donation': donation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ---------------------- Управление центрами донации ---------------------- #

@admin_bp.route('/donation-centers', methods=['GET'])
@jwt_required()
@admin_required
def get_all_donation_centers():
    """Получение списка всех центров донации"""
    centers = DonationCenter.get_all()
    
    return jsonify({
        'centers': [center.to_dict() for center in centers]
    }), 200

@admin_bp.route('/donation-centers', methods=['POST'])
@jwt_required()
@admin_required
def create_donation_center():
    """Создание нового центра донации"""
    data = request.get_json()
    
    if not data.get('name') or not data.get('address'):
        return jsonify({'error': 'Название и адрес центра обязательны'}), 400
    
    try:
        new_center = DonationCenter(
            name=data['name'],
            address=data['address'],
            working_hours=data.get('working_hours'),
            phone=data.get('phone')
        )
        
        db.session.add(new_center)
        db.session.commit()
        
        return jsonify({
            'message': 'Центр донации успешно создан',
            'center': new_center.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ---------------------- Статистика ---------------------- #

@admin_bp.route('/statistics', methods=['GET'])
@jwt_required()
@admin_required
def get_statistics():
    """Получение общей статистики системы"""
    try:
        # Количество пользователей
        users_count = User.query.count()
        donors_count = User.query.filter_by(role='donor').count()
        recipients_count = User.query.filter_by(role='recipient').count()
        
        # Количество запросов на донацию
        requests_count = DonationRequest.query.count()
        pending_requests = DonationRequest.query.filter_by(status='pending').count()
        fulfilled_requests = DonationRequest.query.filter_by(status='fulfilled').count()
        canceled_requests = DonationRequest.query.filter_by(status='canceled').count()
        
        # Статистика по донациям
        donations_count = Donation.query.count()
        scheduled_donations = Donation.query.filter_by(status='scheduled').count()
        completed_donations = Donation.query.filter_by(status='completed').count()
        canceled_donations = Donation.query.filter_by(status='canceled').count()
        
        # Статистика по группам крови доноров
        blood_types = {}
        for blood_type in ['I', 'II', 'III', 'IV']:
            for rh_factor in ['positive', 'negative']:
                count = User.query.filter_by(
                    role='donor',
                    blood_type=blood_type,
                    rh_factor=rh_factor
                ).count()
                blood_types[f"{blood_type} {'+' if rh_factor == 'positive' else '-'}"] = count
        
        # Подготовка ответа
        return jsonify({
            'users': {
                'total': users_count,
                'donors': donors_count,
                'recipients': recipients_count
            },
            'donation_requests': {
                'total': requests_count,
                'pending': pending_requests,
                'fulfilled': fulfilled_requests,
                'canceled': canceled_requests
            },
            'donations': {
                'total': donations_count,
                'scheduled': scheduled_donations,
                'completed': completed_donations,
                'canceled': canceled_donations
            },
            'blood_types': blood_types
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Регистрация Blueprint в __init__.py
def init_admin_routes(app):
    app.register_blueprint(admin_bp)