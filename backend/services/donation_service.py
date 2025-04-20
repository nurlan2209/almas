from models import db
from models.donation import Donation
from models.donation_request import DonationRequest
from models.user import User
from models.donation_center import DonationCenter
from datetime import datetime

class DonationService:
    @staticmethod
    def create_donation(donation_data, donor_id):
        """Создание новой донации"""
        # Проверяем, что донор существует
        donor = User.find_by_id(donor_id)
        if not donor:
            raise ValueError('Донор не найден')
        
        # Проверяем, что роль пользователя - донор
        if donor.role != 'donor':
            raise ValueError('Только доноры могут создавать донации')
        
        # Если указан запрос, проверяем его существование и статус
        request_id = donation_data.get('request_id')
        recipient_id = None
        
        if request_id:
            request = DonationRequest.find_by_id(request_id)
            if not request:
                raise ValueError('Запрос на донацию не найден')
            
            if request.status != 'pending':
                raise ValueError('Запрос на донацию уже выполнен или отменен')
            
            # Проверяем соответствие группы крови и резус-фактора
            if request.blood_type != donation_data.get('blood_type') or request.rh_factor != donation_data.get('rh_factor'):
                raise ValueError('Группа крови и резус-фактор должны соответствовать запросу')
            
            recipient_id = request.recipient_id
        
        # Если указан центр донации, проверяем его существование
        donation_center_id = donation_data.get('donation_center_id')
        if donation_center_id:
            center = DonationCenter.find_by_id(donation_center_id)
            if not center:
                raise ValueError('Центр донации не найден')
        
        # Обработка даты донации
        donation_date = None
        if donation_data.get('donation_date'):
            donation_date = datetime.strptime(donation_data.get('donation_date'), '%Y-%m-%d')
        
        # Создание новой донации
        new_donation = Donation(
            donor_id=donor_id,
            recipient_id=recipient_id,
            request_id=request_id,
            donation_date=donation_date,
            blood_type=donation_data.get('blood_type'),
            rh_factor=donation_data.get('rh_factor'),
            quantity=donation_data.get('quantity'),
            donation_center_id=donation_center_id,
            status='scheduled'
        )
        
        db.session.add(new_donation)
        db.session.commit()
        
        return new_donation
    
    @staticmethod
    def get_donations(user_id, status=None):
        """Получение списка донаций пользователя"""
        # Проверяем, что пользователь существует
        user = User.find_by_id(user_id)
        if not user:
            raise ValueError('Пользователь не найден')
        
        # Формирование запроса в зависимости от роли пользователя
        if user.role == 'donor':
            query = Donation.query.filter_by(donor_id=user_id)
        else:
            query = Donation.query.filter_by(recipient_id=user_id)
        
        # Фильтрация по статусу, если указан
        if status:
            query = query.filter_by(status=status)
        
        # Выполнение запроса и получение результатов
        donations = query.order_by(Donation.donation_date.desc()).all()
        
        return donations
    
    @staticmethod
    def get_scheduled_donations(donor_id=None):
        """Получение списка запланированных донаций"""
        # Формирование базового запроса
        query = Donation.query.filter_by(status='scheduled')
        
        # Фильтрация по донору, если указан
        if donor_id:
            query = query.filter_by(donor_id=donor_id)
        
        # Выполнение запроса и получение результатов
        donations = query.order_by(Donation.donation_date).all()
        
        return donations
    
    @staticmethod
    def complete_donation(donation_id, user_id):
        """Завершение донации"""
        # Находим донацию
        donation = Donation.find_by_id(donation_id)
        if not donation:
            raise ValueError('Донация не найдена')
        
        # Проверяем права доступа
        if donation.donor_id != user_id:
            raise ValueError('У вас нет прав на завершение этой донации')
        
        # Проверяем статус донации
        if donation.status != 'scheduled':
            raise ValueError('Можно завершить только запланированные донации')
        
        # Обновляем статус донации
        donation.update_status('completed')
        
        return donation
    
    @staticmethod
    def cancel_donation(donation_id, user_id):
        """Отмена донации"""
        # Находим донацию
        donation = Donation.find_by_id(donation_id)
        if not donation:
            raise ValueError('Донация не найдена')
        
        # Проверяем права доступа
        if donation.donor_id != user_id:
            raise ValueError('У вас нет прав на отмену этой донации')
        
        # Проверяем статус донации
        if donation.status != 'scheduled':
            raise ValueError('Можно отменить только запланированные донации')
        
        # Обновляем статус донации
        donation.update_status('canceled')
        
        return donation