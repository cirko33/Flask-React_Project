from Configuration.config import db
from marshmallow import Schema, fields
from datetime import datetime

class CreditCard(db.Model):
    __tablename__ = 'credit_card'
    cardNumber = db.Column(db.String(16), primary_key=True) #card number
    userName = db.Column(db.String(32)) #name and surname of card user
    expirationDate = db.Column(db.String(5)) #expiration date
    cvc = db.Column(db.Integer) #cvc
    amount = db.Column(db.Float) #amount of money in RSD
    bankAccountNumber = db.Column(db.String(10)) #bank account number

    def __init__(self, cardNumber, userName, expirationDate, cvc, amount, bankAccountNumber):
        self.cardNumber = cardNumber
        self.userName = userName
        self.expirationDate = expirationDate
        self.cvc = cvc
        self.amount = amount
        self.bankAccountNumber = bankAccountNumber

class CreditCardSchema(Schema):
    cardNumber = fields.Number()
    userName = fields.Str()
    expirationDate = fields.Str()
    cvc = fields.Number()
    amount = fields.Float()
    bankAccountNumber = fields.Str()