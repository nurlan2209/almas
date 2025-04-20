from datetime import datetime
from . import db

class Donation(db.Model):
    __tablename__ = 'donations'
    
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    request_id = db.Column(db.Integer, db.ForeignKey('donation_requests.id'), nullable=True)
    donation_date = db.Column(db.DateTime, nullable=True)
    blood_type = db.Column(db.String(5), nullable=False)
    rh_factor = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    donation_center_id = db.Column(db.Integer, db.ForeignKey('donation_centers.id'), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='scheduled')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Отношения с другими таблицами
    donor = db.relationship('User', foreign_keys=[donor_id], back_populates='donations')
    recipient = db.relationship('User', foreign_keys=[recipient_id], back_populates='received_donations')
    request = db.relationship('DonationRequest', back_populates='donations')
    donation_center = db.relationship('DonationCenter', back_populates='donations')
    
    def __init__(self, donor_id, blood_type, rh_factor, quantity, status='scheduled', 
                 recipient_id=None, request_id=None, donation_center_id=None, donation_date=None):
        self.donor_id = donor_id
        self.recipient_id = recipient_id
        self.request_id = request_id
        self.donation_date = donation_date
        self.blood_type = blood_type
        self.rh_factor = rh_factor
        self.quantity = quantity
        self.donation_center_id = donation_center_id
        self.status = status
    
    def to_dict(self, include_donor=False, include_recipient=False, include_center=False):
        """Преобразование объекта в словарь для API"""
        data = {
            'id': self.id,
            'donor_id': self.donor_id,
            'recipient_id': self.recipient_id,
            'request_id': self.request_id,
            'donation_date': self.donation_date.isoformat() if self.donation_date else None,
            'blood_type': self.blood_type,
            'rh_factor': self.rh_factor,
            'quantity': self.quantity,
            'donation_center_id': self.donation_center_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_donor and self.donor:
            data['donor'] = self.donor.to_dict()
        
        if include_recipient and self.recipient:
            data['recipient'] = self.recipient.to_dict()
        
        if include_center and self.donation_center:
            data['donation_center'] = self.donation_center.to_dict()
        
        return data
    
    def update_status(self, status):
        """Обновление статуса донации"""
        self.status = status
        db.session.commit()
        
        # Если донация завершена и связана с запросом, обновляем статус запроса
        if status == 'completed' and self.request:
            # Проверяем, достаточно ли донаций для выполнения запроса
            total_donated = sum([d.quantity for d in self.request.donations if d.status == 'completed'])
            if total_donated >= self.request.quantity_needed:
                self.request.update_status('fulfilled')
    
    @classmethod
    def find_by_id(cls, id):
        """Поиск донации по ID"""
        return cls.query.get(id)
    
    @classmethod
    def find_by_donor(cls, donor_id):
        """Поиск донаций по ID донора"""
        return cls.query.filter_by(donor_id=donor_id).order_by(cls.donation_date.desc()).all()
    
    @classmethod
    def find_by_recipient(cls, recipient_id):
        """Поиск донаций по ID реципиента"""
        return cls.query.filter_by(recipient_id=recipient_id).order_by(cls.donation_date.desc()).all()
    
    @classmethod
    def find_by_request(cls, request_id):
        """Поиск донаций по ID запроса"""
        return cls.query.filter_by(request_id=request_id).all()
    
    @classmethod
    def get_upcoming_donations(cls, donor_id=None):
        """Получение предстоящих донаций"""
        query = cls.query.filter(cls.status == 'scheduled')
        if donor_id:
            query = query.filter(cls.donor_id == donor_id)
        return query.order_by(cls.donation_date).all()