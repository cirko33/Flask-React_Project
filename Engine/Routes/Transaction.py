from Configuration.config import api, jsonify, db
from flask_restful import Resource
from Models.__init__ import Transaction
from Configuration.config import reqparse

transactionMakingArgs = reqparse.RequestParser();
transactionMakingArgs.add_argument("sender", type=str)
transactionMakingArgs.add_argument("receiver", type=str, help="Receiver is required", required = True)
transactionMakingArgs.add_argument("amount", type=float, help="Amount can't be 0 and it's required", required = True)

#Transaction get (history) and post (making new transaction)
class TransactionProfile(Resource):
    def get(self, userEmail):
        transactionSender =  db.session.execute(db.select(Transaction).filter_by(sender=userEmail)).all()
        transactionReceiver = db.session.execute(db.select(Transaction).filter_by(receiver=userEmail)).all()
        transaction = transactionSender + transactionReceiver
        
        if transaction:
            return jsonify(transaction), 200
        else:
            return "You don't have any transaction.", 400
    
    def post(self, data):
        return "transaction-post", 200

api.add_resource(TransactionProfile, "/transaction")