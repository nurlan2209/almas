from models import db
from models.user import User
from utils.security import hash_password, verify_password

class UserService:
    @staticmethod
    def create_user(user_data):
        """Создание нового пользователя"""
        # Проверяем, существует ли пользователь с таким email
        if User.find_by_email(user_data.get('email')):
            raise ValueError('Пользователь с таким email уже существует')
        
        # Создаем нового пользователя
        new_user = User(
            email=user_data.get('email'),
            password=user_data.get('password'),
            first_name=user_data.get('firstName'),
            last_name=user_data.get('lastName'),
            role=user_data.get('role'),
            patronymic=user_data.get('patronymic'),
            iin=user_data.get('iin'),
            birth_date=user_data.get('birthDate'),
            gender=user_data.get('gender'),
            phone_number=user_data.get('phoneNumber'),
            address=user_data.get('address'),
            blood_type=user_data.get('bloodType'),
            rh_factor=user_data.get('rhFactor'),
            height=user_data.get('height'),
            weight=user_data.get('weight'),
            has_chronic_diseases=user_data.get('hasChronicDiseases', False),
            chronic_diseases_details=user_data.get('chronicDiseasesDetails')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user
    
    @staticmethod
    def update_user(user_id, user_data):
        """Обновление данных пользователя"""
        user = User.find_by_id(user_id)
        if not user:
            raise ValueError('Пользователь не найден')
        
        # Обновляем основные поля пользователя
        if 'firstName' in user_data:
            user.first_name = user_data.get('firstName')
        
        if 'lastName' in user_data:
            user.last_name = user_data.get('lastName')
        
        if 'patronymic' in user_data:
            user.patronymic = user_data.get('patronymic')
        
        if 'phoneNumber' in user_data:
            user.phone_number = user_data.get('phoneNumber')
        
        if 'address' in user_data:
            user.address = user_data.get('address')
        
        if 'bloodType' in user_data:
            user.blood_type = user_data.get('bloodType')
        
        if 'rhFactor' in user_data:
            user.rh_factor = user_data.get('rhFactor')
        
        if 'height' in user_data:
            user.height = user_data.get('height')
        
        if 'weight' in user_data:
            user.weight = user_data.get('weight')
        
        if 'hasChronicDiseases' in user_data:
            user.has_chronic_diseases = user_data.get('hasChronicDiseases')
        
        if 'chronicDiseasesDetails' in user_data:
            user.chronic_diseases_details = user_data.get('chronicDiseasesDetails')
        
        db.session.commit()
        
        return user
    
    @staticmethod
    def change_password(user_id, current_password, new_password):
        """Изменение пароля пользователя"""
        user = User.find_by_id(user_id)
        if not user:
            raise ValueError('Пользователь не найден')
        
        # Проверяем текущий пароль
        if not user.check_password(current_password):
            raise ValueError('Неверный текущий пароль')
        
        # Устанавливаем новый пароль
        user.set_password(new_password)
        db.session.commit()
        
        return True
    
    @staticmethod
    def get_donors(filters=None):
        """Получение списка доноров с фильтрацией"""
        filters = filters or {}
        
        # Формируем базовый запрос
        query = User.query.filter_by(role='donor')
        
        # Применяем фильтры, если они указаны
        if 'blood_type' in filters and filters['blood_type']:
            query = query.filter_by(blood_type=filters['blood_type'])
        
        if 'rh_factor' in filters and filters['rh_factor']:
            query = query.filter_by(rh_factor=filters['rh_factor'])
        
        # Выполняем запрос и получаем результаты
        donors = query.all()
        
        return donors
    
    @staticmethod
    def get_recipients(filters=None):
        """Получение списка реципиентов с фильтрацией"""
        filters = filters or {}
        
        # Формируем базовый запрос
        query = User.query.filter_by(role='recipient')
        
        # Применяем фильтры, если они указаны
        if 'blood_type' in filters and filters['blood_type']:
            query = query.filter_by(blood_type=filters['blood_type'])
        
        if 'rh_factor' in filters and filters['rh_factor']:
            query = query.filter_by(rh_factor=filters['rh_factor'])
        
        # Выполняем запрос и получаем результаты
        recipients = query.all()
        
        return recipients