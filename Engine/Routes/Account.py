from Configuration.config import *
from flask_restful import Resource, reqparse
from Models.__init__ import Account, Balance

#Account
class AccountProfile(Resource):
    '''
    Account profile get (get profile by email) and post (post profile) ?
    '''
    def get(self, token):
        if token not in activeTokens.keys():
            return "Please login to continue.", 404
        email = activeTokens[token]
        temp = db.session.execute(db.select(Account).filter_by(userEmail=email)).one_or_none()
        if not temp:
            return "User with this email does not own any cards", 404
        else:
            return jsonify(temp), 200

api.add_resource(AccountProfile, "/accountProfile")


accountBalanceAddingArgs = reqparse.RequestParser()
accountBalanceAddingArgs.add_argument("number", type=int, help="Number (account or bank) is required", required=True)
accountBalanceAddingArgs.add_argument("amount", type=float, help="Value is required", required=True)
accountBalanceAddingArgs.add_argument("currency", type=str, help="Currency is required", required=True)
accountBalanceAddingArgs.add_argument("type", type=int, help="Type of is required", required=True)

#Account balance get and post (withdraw of money)
class AccountBalance(Resource):
    def get(self, token):
        if token not in activeTokens.keys():
            return "Please login to continue.", 404
        email = activeTokens[token]
        account = db.session.execute(db.select(Account).filter_by(email=email)).one_or_none()
        if not account:
            return "Error, no account found", 404
        temp = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
        if not temp:
            return "Account doesn't have any balance", 404
        else:
            return jsonify(temp), 200
    
    #Type of payment - on online account = 1, on bank account = 2
    def post(self, token):
        return "sad nis", 200

api.add_resource(AccountBalance, "/accountBalance")