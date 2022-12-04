from Configuration.config import db
from marshmallow import Schema, fields
from datetime import datetime

class CreditCard(db.Model):
    __tablename__ = 'credit_card'
    cardNumber = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    expirationDate = db.Column(db.DateTime, default = datetime.utcnow)
    cvc = db.Column(db.Integer)


    def __init__(self, cardNumber, name, expirationDate, cvc):
        self.cardNumber = cardNumber
        self.name = name
        self.expirationDate = expirationDate
        self.cvc = cvc

class CreditCardSchema(Schema):
    cardNumber = fields.Number()
    name = fields.Str()
    expirationDate = fields.Str()
    cvc = fields.Number()