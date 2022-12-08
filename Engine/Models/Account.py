from Configuration.config import db
from marshmallow import Schema, fields

class Account(db.Model):
    __tablename__ = 'account'
    accountNumber = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userEmail = db.Column(db.String(64))
    cardNumber = db.Column(db.Integer)

    def __init__(self, userEmail, cardNumber):
        self.userEmail = userEmail
        self.cardNumber = cardNumber

class CreditCardSchema(Schema):
    accountNumber = fields.Number()
    userEmail = fields.Str()
    cardNumber = fields.Number()