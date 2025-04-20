from datetime import datetime
from . import db
from passlib.hash import pbkdf2_sha256

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    patronymic = db.Column(db.String(50))
    iin = db.Column(db.String(12), unique=True, nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.String(12), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    blood_type = db.Column(db.String(5))
    rh_factor = db.Column(db.String(10))
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    has_chronic_diseases = db.Column(db.Boolean, default=False)
    chronic_diseases_details = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Отношения с другими таблицами
    donations = db.relationship('Donation', foreign_keys='Donation.donor_id', back_populates='donor')
    received_donations = db.relationship('Donation', foreign_keys='Donation.recipient_id', back_populates='recipient')
    donation_requests = db.relationship('DonationRequest', back_populates='recipient')
    
    def __init__(self, email, password, first_name, last_name, role, **kwargs):
        self.email = email
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        
        # Дополнительные поля
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def set_password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)
    
    def check_password(self, password):
        return pbkdf2_sha256.verify(password, self.password_hash)
    
    def to_dict(self, include_sensitive=False):
        """Преобразование объекта в словарь для API"""
        data = {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'patronymic': self.patronymic,
            'iin': self.iin,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'gender': self.gender,
            'role': self.role,
            'phone_number': self.phone_number,
            'address': self.address,
            'blood_type': self.blood_type,
            'rh_factor': self.rh_factor,
            'height': self.height,
            'weight': self.weight,
            'has_chronic_diseases': self.has_chronic_diseases,
            'chronic_diseases_details': self.chronic_diseases_details,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        # Включаем чувствительные данные только если требуется
        if include_sensitive:
            data.update({
                'iin': self.iin,
                'birth_date': self.birth_date.isoformat() if self.birth_date else None,
                'chronic_diseases_details': self.chronic_diseases_details
            })
        
        return data
    
    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.get(user_id)
    
    @classmethod
    def find_donors_by_blood_type(cls, blood_type, rh_factor):
        """Поиск доноров по группе крови и резус-фактору"""
        return cls.query.filter_by(
            role='donor',
            blood_type=blood_type,
            rh_factor=rh_factor
        ).all()
    
    @classmethod
    def find_recipients_by_blood_type(cls, blood_type, rh_factor):
        """Поиск реципиентов по группе крови и резус-фактору"""
        return cls.query.filter_by(
            role='recipient',
            blood_type=blood_type,
            rh_factor=rh_factor
        ).all()