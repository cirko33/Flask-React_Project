from Configuration.config import api
from flask_restful import Resource

#Transaction get (history) and post (making new transaction)
class Transaction(Resource):
    def get(self):
        return "transaction-get"
    
    def post(self):
        return "transaction-post"

api.add_resource(Transaction, "/transaction")