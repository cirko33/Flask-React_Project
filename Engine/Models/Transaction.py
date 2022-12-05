from marshmallow import Schema, fields
from Configuration.config import db
class Transaction(db.Model):
    __tablename__ = 'transaction'
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(64))
    receiver = db.Column(db.String(64))
    amount = db.Column(db.Integer)
    state = db.Column(db.String(32))

    def __init__(self, id, sender, receiver, amount, state):
        self.id = id
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.state = state

class TransactionSchema(Schema):
    id = fields.Number()
    sender = fields.Str()
    receiver = fields.Str()
    amount = fields.Number()
    state = fields.Str()
