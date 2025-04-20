import re
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

def validate_password(password):
    """Проверка пароля: минимум 8 символов, буквы и цифры"""
    if not password or not isinstance(password, str):
        return False
    return len(password) >= 8 and bool(re.search(r'[A-Za-z]', password)) and bool(re.search(r'\d', password))

def validate_user_registration(data):
    errors = {}
    
    # Проверка email
    if not data.get('email'):
        errors['email'] = 'Email обязателен'
    else:
        try:
            validate_email(data['email'], check_deliverability=False)
        except EmailNotValidError:
            errors['email'] = 'Некорректный формат email'
    
    # Проверка пароля
    if not data.get('password'):
        errors['password'] = 'Пароль обязателен'
    elif not validate_password(data['password']):
        errors['password'] = 'Пароль должен содержать минимум 8 символов, буквы и цифры'
    
    # Проверка имени и фамилии
    if not data.get('first_name'):
        errors['first_name'] = 'Имя обязательно'
    if not data.get('last_name'):
        errors['last_name'] = 'Фамилия обязательна'
    
    # Проверка других обязательных полей
    if not data.get('iin'):
        errors['iin'] = 'ИИН обязателен'
    if not data.get('birth_date'):
        errors['birth_date'] = 'Дата рождения обязательна'
    if not data.get('gender'):
        errors['gender'] = 'Пол обязателен'
    if not data.get('role'):
        errors['role'] = 'Роль обязательна'
    if not data.get('phone_number'):
        errors['phone_number'] = 'Номер телефона обязателен'
    if not data.get('address'):
        errors['address'] = 'Адрес обязателен'
    
    return errors

def validate_login(data):
    """Валидация данных при входе в систему"""
    errors = {}
    
    # Проверка email
    if not data.get('email'):
        errors['email'] = 'Email обязателен'
    else:
        try:
            validate_email(data['email'], check_deliverability=False)
        except EmailNotValidError:
            errors['email'] = 'Некорректный формат email'
    
    # Проверка пароля
    if not data.get('password'):
        errors['password'] = 'Пароль обязателен'
    
    return errors

def validate_donation_request(data):
    """Валидация данных при создании запроса на донацию"""
    errors = {}
    
    # Проверка группы крови
    if not data.get('blood_type'):
        errors['blood_type'] = 'Группа крови обязательна'
    elif data['blood_type'] not in ['I', 'II', 'III', 'IV']:
        errors['blood_type'] = 'Неверная группа крови'
    
    # Проверка резус-фактора
    if not data.get('rh_factor'):
        errors['rh_factor'] = 'Резус-фактор обязателен'
    elif data['rh_factor'] not in ['positive', 'negative']:
        errors['rh_factor'] = 'Неверный резус-фактор'
    
    # Проверка необходимого количества крови
    if not data.get('quantity_needed'):
        errors['quantity_needed'] = 'Необходимое количество обязательно'
    elif not isinstance(data['quantity_needed'], int) or data['quantity_needed'] <= 0:
        errors['quantity_needed'] = 'Необходимое количество должно быть положительным числом'
    
    # Проверка уровня срочности
    if not data.get('urgency_level'):
        errors['urgency_level'] = 'Уровень срочности обязателен'
    elif data['urgency_level'] not in ['low', 'medium', 'high', 'critical']:
        errors['urgency_level'] = 'Неверный уровень срочности'
    
    return errors

def validate_donation(data):
    """Валидация данных при создании донации"""
    errors = {}
    
    # Проверка группы крови
    if not data.get('blood_type'):
        errors['blood_type'] = 'Группа крови обязательна'
    elif data['blood_type'] not in ['I', 'II', 'III', 'IV']:
        errors['blood_type'] = 'Неверная группа крови'
    
    # Проверка резус-фактора
    if not data.get('rh_factor'):
        errors['rh_factor'] = 'Резус-фактор обязателен'
    elif data['rh_factor'] not in ['positive', 'negative']:
        errors['rh_factor'] = 'Неверный резус-фактор'
    
    # Проверка количества крови
    if not data.get('quantity'):
        errors['quantity'] = 'Количество обязательно'
    elif not isinstance(data['quantity'], int) or data['quantity'] <= 0:
        errors['quantity'] = 'Количество должно быть положительным числом'
    
    # Проверка даты донации
    if data.get('donation_date'):
        try:
            donation_date = datetime.strptime(data['donation_date'], '%Y-%m-%d').date()
            today = datetime.now().date()
            
            if donation_date < today:
                errors['donation_date'] = 'Дата донации не может быть в прошлом'
        except ValueError:
            errors['donation_date'] = 'Неверный формат даты донации'
    
    return errors