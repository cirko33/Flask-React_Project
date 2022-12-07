from marshmallow import Schema, fields
from Configuration.config import db

class Balance(db.Model):
    __tablename__ = 'balance'
    id = db.Column(db.Integer, primary_key=True)
    userEmail = db.Column(db.String(64))
    currency = db.Column(db.Integer)
    amount = db.Column(db.Float)

    def __init__(self, id, userEmail, amount, currency):
        self.id = id
        self.userEmail = userEmail
        self.amount = amount
        self.currency = currency

class BalanceSchema(Schema):
    id = fields.Number()
    userEmail = fields.Str()
    amount = fields.Float()
    currency = fields.Number()