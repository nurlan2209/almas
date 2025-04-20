from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models to make them available
from .user import User
from .donation_center import DonationCenter
from .donation_request import DonationRequest
from .donation import Donation