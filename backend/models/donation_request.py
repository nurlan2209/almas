from datetime import datetime
from . import db

class DonationRequest(db.Model):
    __tablename__ = 'donation_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)
    rh_factor = db.Column(db.String(10), nullable=False)
    quantity_needed = db.Column(db.Integer, nullable=False)
    urgency_level = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    hospital_name = db.Column(db.String(255), nullable=True)
    hospital_address = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Отношения с другими таблицами
    recipient = db.relationship('User', back_populates='donation_requests')
    donations = db.relationship('Donation', back_populates='request')
    
    def __init__(self, recipient_id, blood_type, rh_factor, quantity_needed, urgency_level, 
                 status='pending', hospital_name=None, hospital_address=None, description=None):
        self.recipient_id = recipient_id
        self.blood_type = blood_type
        self.rh_factor = rh_factor
        self.quantity_needed = quantity_needed
        self.urgency_level = urgency_level
        self.status = status
        self.hospital_name = hospital_name
        self.hospital_address = hospital_address
        self.description = description
    
    def to_dict(self, include_recipient=False):
        """Преобразование объекта в словарь для API"""
        data = {
            'id': self.id,
            'recipient_id': self.recipient_id,
            'blood_type': self.blood_type,
            'rh_factor': self.rh_factor,
            'quantity_needed': self.quantity_needed,
            'urgency_level': self.urgency_level,
            'status': self.status,
            'hospital_name': self.hospital_name,
            'hospital_address': self.hospital_address,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_recipient and self.recipient:
            data['recipient'] = self.recipient.to_dict()
        
        return data
    
    def update_status(self, status):
        """Обновление статуса запроса"""
        self.status = status
        db.session.commit()
    
    @classmethod
    def find_by_id(cls, id):
        """Поиск запроса по ID"""
        return cls.query.get(id)
    
    @classmethod
    def find_by_recipient(cls, recipient_id):
        """Поиск запросов по ID реципиента"""
        return cls.query.filter_by(recipient_id=recipient_id).all()
    
    @classmethod
    def find_by_blood_type(cls, blood_type, rh_factor, status='pending'):
        """Поиск активных запросов по группе крови и резус-фактору"""
        return cls.query.filter_by(
            blood_type=blood_type,
            rh_factor=rh_factor,
            status=status
        ).order_by(cls.urgency_level.desc()).all()
    
    @classmethod
    def get_active_requests(cls):
        """Получение всех активных запросов"""
        return cls.query.filter_by(status='pending').order_by(
            cls.urgency_level.desc(), 
            cls.created_at.desc()
        ).all()