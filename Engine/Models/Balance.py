from Configuration.config import db
from marshmallow import Schema, fields

class Balance(db.Model):
    __tablename__ = "balance"
    pk = db.Column(db.Integer, primary_key=True, autoincrement=True) #primary key
    accountNumber = db.Column(db.Integer) #online account number (can have more)
    amount = db.Column(db.Float) #amount of money in currency bellow
    currency = db.Column(db.String(3)) #currency code

    def __init__(self, accountNumber, amount, currency):
        self.accountNumber = accountNumber
        self.amount = amount
        self.currency = currency

class BalanceSchema(Schema):
    pk = fields.Number()
    accountNumber = fields.Number()
    amount = fields.Number()
    currency = fields.Str()
