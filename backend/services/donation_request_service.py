from models import db
from models.donation_request import DonationRequest
from models.user import User

class DonationRequestService:
    @staticmethod
    def create_request(request_data, recipient_id):
        """Создание нового запроса на донацию"""
        # Проверяем, что пользователь существует
        recipient = User.find_by_id(recipient_id)
        if not recipient:
            raise ValueError('Пользователь не найден')
        
        # Проверяем, что роль пользователя - реципиент
        if recipient.role != 'recipient':
            raise ValueError('Только реципиенты могут создавать запросы на донацию')
        
        # Создаем новый запрос
        new_request = DonationRequest(
            recipient_id=recipient_id,
            blood_type=request_data.get('blood_type'),
            rh_factor=request_data.get('rh_factor'),
            quantity_needed=request_data.get('quantity_needed'),
            urgency_level=request_data.get('urgency_level'),
            hospital_name=request_data.get('hospital_name'),
            hospital_address=request_data.get('hospital_address'),
            description=request_data.get('description')
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        return new_request
    
    @staticmethod
    def update_request(request_id, request_data, recipient_id):
        """Обновление запроса на донацию"""
        # Находим запрос
        request = DonationRequest.find_by_id(request_id)
        if not request:
            raise ValueError('Запрос на донацию не найден')
        
        # Проверяем права доступа
        if request.recipient_id != recipient_id:
            raise ValueError('У вас нет прав на редактирование этого запроса')
        
        # Проверяем статус запроса
        if request.status != 'pending':
            raise ValueError('Можно редактировать только ожидающие запросы')
        
        # Обновляем поля запроса
        if 'urgency_level' in request_data:
            request.urgency_level = request_data.get('urgency_level')
        
        if 'hospital_name' in request_data:
            request.hospital_name = request_data.get('hospital_name')
        
        if 'hospital_address' in request_data:
            request.hospital_address = request_data.get('hospital_address')
        
        if 'description' in request_data:
            request.description = request_data.get('description')
        
        db.session.commit()
        
        return request
    
    @staticmethod
    def cancel_request(request_id, recipient_id):
        """Отмена запроса на донацию"""
        # Находим запрос
        request = DonationRequest.find_by_id(request_id)
        if not request:
            raise ValueError('Запрос на донацию не найден')
        
        # Проверяем права доступа
        if request.recipient_id != recipient_id:
            raise ValueError('У вас нет прав на отмену этого запроса')
        
        # Проверяем статус запроса
        if request.status != 'pending':
            raise ValueError('Можно отменить только ожидающие запросы')
        
        # Обновляем статус запроса
        request.status = 'canceled'
        db.session.commit()
        
        return request
    
    @staticmethod
    def get_requests(filters=None):
        """Получение списка запросов на донацию с фильтрацией"""
        filters = filters or {}
        
        # Формируем базовый запрос
        query = DonationRequest.query
        
        # Применяем фильтры, если они указаны
        if 'status' in filters and filters['status']:
            query = query.filter_by(status=filters['status'])
        else:
            # По умолчанию показываем только активные запросы
            query = query.filter_by(status='pending')
        
        if 'blood_type' in filters and filters['blood_type']:
            query = query.filter_by(blood_type=filters['blood_type'])
        
        if 'rh_factor' in filters and filters['rh_factor']:
            query = query.filter_by(rh_factor=filters['rh_factor'])
        
        if 'recipient_id' in filters and filters['recipient_id']:
            query = query.filter_by(recipient_id=filters['recipient_id'])
        
        # Сортировка по уровню срочности и дате создания
        query = query.order_by(DonationRequest.urgency_level.desc(), DonationRequest.created_at.desc())
        
        # Выполняем запрос и получаем результаты
        requests = query.all()
        
        return requests