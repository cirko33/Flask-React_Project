from Configuration.config import api, jsonify
from flask_restful import Resource
from Models import *

#Transaction get (history) and post (making new transaction)
class Transaction(Resource):
    def get(self, userEmail):
        transactionSender = Transaction.query.filter_by(sender = userEmail).all()
        transactionReceiver = Transaction.query.filter_by(receiver = userEmail).all()
        transaction = transactionSender + transactionReceiver
        
        if transaction:
            return jsonify(transaction), 200
        else:
            return "You don't have any transaction.", 400
    
    def post(self):
        return "transaction-post"

api.add_resource(Transaction, "/transaction")