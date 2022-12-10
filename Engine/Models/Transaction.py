from marshmallow import Schema, fields
from Configuration.config import db

class Transaction(db.Model):
    __tablename__ = 'transaction'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True) #
    sender = db.Column(db.String(64)) #account number that sent money
    receiver = db.Column(db.String(64)) #account number that received money
    amount = db.Column(db.Float) #amount of money sent in currency bellow
    currency = db.Column(db.String(3)) #currency
    state = db.Column(db.String(32)) #state of transaction (In progress, Approved, Denied)


    def __init__(self, sender, receiver, amount, currency, state):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.currency = currency
        self.state = state

class TransactionSchema(Schema):
    id = fields.Number()
    sender = fields.Str()
    receiver = fields.Str()
    amount = fields.Float()
    currency = fields.Str()
    state = fields.Str()
