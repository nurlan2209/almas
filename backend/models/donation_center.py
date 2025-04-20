from datetime import datetime
from . import db

class DonationCenter(db.Model):
    __tablename__ = 'donation_centers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    working_hours = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Отношения с другими таблицами
    donations = db.relationship('Donation', back_populates='donation_center')
    
    def __init__(self, name, address, working_hours=None, phone=None):
        self.name = name
        self.address = address
        self.working_hours = working_hours
        self.phone = phone
    
    def to_dict(self):
        """Преобразование объекта в словарь для API"""
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'working_hours': self.working_hours,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def find_by_id(cls, id):
        """Поиск центра донации по ID"""
        return cls.query.get(id)
    
    @classmethod
    def get_all(cls):
        """Получение всех центров донации"""
        return cls.query.all()