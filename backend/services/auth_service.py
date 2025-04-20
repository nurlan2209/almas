from models.user import User
from utils.security import verify_password, generate_token

class AuthService:
    @staticmethod
    def authenticate(email, password):
        """Аутентификация пользователя по email и паролю"""
        # Находим пользователя по email
        user = User.find_by_email(email)
        
        # Проверяем, что пользователь существует и пароль верный
        if not user or not user.check_password(password):
            return None
        
        # Возвращаем пользователя при успешной аутентификации
        return user
    
    @staticmethod
    def login(email, password):
        """Вход пользователя в систему"""
        user = AuthService.authenticate(email, password)
        
        if not user:
            raise ValueError('Неверный email или пароль')
        
        # Генерируем JWT токен для пользователя
        token = generate_token(user.id)
        
        return {
            'user': user,
            'token': token
        }
    
    @staticmethod
    def get_current_user(user_id):
        """Получение текущего пользователя по ID"""
        user = User.find_by_id(user_id)
        
        if not user:
            raise ValueError('Пользователь не найден')
        
        return user