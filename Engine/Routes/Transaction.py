from Configuration.config import api, jsonify, db, activeTokens, make_response, reqparse
from flask_restful import Resource
from Models.__init__ import Transaction, TransactionSchema
from Processing.__init__ import addTransaction

transactionArgs = reqparse.RequestParser()
transactionArgs.add_argument("type", type=str, help="Type of transaction is required", required = True)
transactionArgs.add_argument("receiver", type=str, help="Receiver (User email or account number) is required", required = True)
transactionArgs.add_argument("amount", type=float, help="Amount can't be 0 and it's required", required = True)
transactionArgs.add_argument("currency", type=str, help="Currency is required", required = True)

#Transaction get (history) and post (making new transaction)
class TransactionProfile(Resource):
    def get(self, token):
        """ Get all transaction for a given user (token) """        
        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 400
            email = activeTokens[token]

            transactionSender = db.session.execute(db.select(Transaction).filter_by(sender=email)).all()
            transactionReceiver = db.session.execute(db.select(Transaction).filter_by(receiver=email, state = "Accepted")).all()
            
            transactions = transactionSender + transactionReceiver
            if len(transactions) == 0:
                return "There is no transaction", 200
            
            list = []
            for transaction in transactions:
                transaction_schema = TransactionSchema()
                result = transaction_schema.dump(transaction["Transaction"])
                list.append(result)                
            return make_response(jsonify(list), 200)    
        except Exception as e:
            return 'Error: ' + str(e), 500
            
    def post(self, token):
        """ Send transaction request """
        try:
            args = transactionArgs.parse_args()
            if token not in activeTokens.keys():
                return "Please login to continue.", 400
            email = activeTokens[token]
            
            if args["receiver"] == email:
                return "Can't send money to yourself", 400
                
            if args["amount"] <= 0:
                return "Amount must be greater than 0", 400
            addTransaction(token, (email, args['receiver'], args['amount'], args['currency'], args['type']))
            return "OK", 200
        except Exception as e:
            return 'Error: ' + str(e), 500

api.add_resource(TransactionProfile, "/transaction/<string:token>")

