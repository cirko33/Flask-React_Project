class Transaction():
    def __init__(self, sender, receiver, amount, state):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.state = state