from marshmallow import Schema, fields
class Transaction():
    def __init__(self, sender, receiver, amount, state):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.state = state

class TransactionSchema(Schema):
    sender = fields.Str()
    receiver = fields.Str()
    amount = fields.Number()
    state = fields.Str()
