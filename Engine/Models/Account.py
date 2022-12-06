from Configuration.config import db
from marshmallow import Schema, fields
import random 

class Account(db.Model):
    __tablename__ = 'credit_card'
    accountNumber = db.Column(db.Integer, primary_key=True)
    userEmail = db.Column(db.String(64))
    amount = db.Column(db.Float)
    cardNumber = db.Column(db.Integer)

    def __init__(self, userEmail, cardNumber):
        self.accountNumber = random(18)
        self.userEmail = userEmail
        self.amount = 0.0
        self.cardNumber = cardNumber

class CreditCardSchema(Schema):
    accountNumber = fields.Number()
    amount = fields.Number()
    userEmail = fields.Str()
    cardNumber = fields.Number()