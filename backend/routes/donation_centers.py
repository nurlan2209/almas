from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import donation_centers_bp
from models import db
from models.donation_center import DonationCenter

@donation_centers_bp.route('', methods=['GET'])
def get_all_centers():
    """Получение списка всех центров сдачи крови"""
    centers = DonationCenter.get_all()
    
    # Преобразование результатов в формат JSON
    centers_data = [center.to_dict() for center in centers]
    
    return jsonify({'centers': centers_data}), 200

@donation_centers_bp.route('/<int:center_id>', methods=['GET'])
def get_center(center_id):
    """Получение информации о конкретном центре сдачи крови"""
    center = DonationCenter.find_by_id(center_id)
    
    if not center:
        return jsonify({'error': 'Центр сдачи крови не найден'}), 404
    
    return jsonify({'center': center.to_dict()}), 200

@donation_centers_bp.route('', methods=['POST'])
@jwt_required()
def create_center():
    """Создание нового центра сдачи крови (только для администратора)"""
    # Проверка прав доступа (в будущем)
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Проверка обязательных полей
    if not data.get('name') or not data.get('address'):
        return jsonify({'error': 'Название и адрес центра обязательны'}), 400
    
    # Создание нового центра
    try:
        new_center = DonationCenter(
            name=data['name'],
            address=data['address'],
            working_hours=data.get('workingHours') or data.get('working_hours'),
            phone=data.get('phone')
        )
        
        db.session.add(new_center)
        db.session.commit()
        
        return jsonify({
            'message': 'Центр сдачи крови успешно создан',
            'center': new_center.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donation_centers_bp.route('/<int:center_id>', methods=['PUT'])
@jwt_required()
def update_center(center_id):
    """Обновление информации о центре сдачи крови (только для администратора)"""
    # Проверка прав доступа (в будущем)
    
    # Поиск центра в базе данных
    center = DonationCenter.find_by_id(center_id)
    
    if not center:
        return jsonify({'error': 'Центр сдачи крови не найден'}), 404
    
    # Получение данных из запроса
    data = request.get_json()
    
    # Обновление данных центра
    try:
        if 'name' in data:
            center.name = data['name']
        
        if 'address' in data:
            center.address = data['address']
        
        if 'workingHours' in data:
            center.working_hours = data['workingHours']
        elif 'working_hours' in data:
            center.working_hours = data['working_hours']
        
        if 'phone' in data:
            center.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Центр сдачи крови успешно обновлен',
            'center': center.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donation_centers_bp.route('/<int:center_id>', methods=['DELETE'])
@jwt_required()
def delete_center(center_id):
    """Удаление центра сдачи крови (только для администратора)"""
    # Проверка прав доступа (в будущем)
    
    # Поиск центра в базе данных
    center = DonationCenter.find_by_id(center_id)
    
    if not center:
        return jsonify({'error': 'Центр сдачи крови не найден'}), 404
    
    # Удаление центра
    try:
        db.session.delete(center)
        db.session.commit()
        
        return jsonify({'message': 'Центр сдачи крови успешно удален'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500