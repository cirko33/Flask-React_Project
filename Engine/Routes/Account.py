from Configuration.config import *
from flask_restful import Resource, reqparse
from Models.__init__ import User, Balance

#Account
accountBalanceArgs = reqparse.RequestParser()
accountBalanceArgs.add_argument("amount", type=float, help="Value is required", required=True)

#Account balance get and post (withdraw of money)
class Account(Resource):
    def get(self, token):
        if token not in activeTokens.keys():
            return "Please login to continue.", 404
        email = activeTokens[token]
        account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
        if not account:
            return "Error, no account found", 404
        balance = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()['Balance']
        if not balance:
            return "Account doesn't have any balance", 404
        else:
            return jsonify(balance), 200
    
    #Deposit from credit card to account
    def post(self, token):
        if token not in activeTokens.keys():
            return "Please login to continue.", 404
        email = activeTokens[token]     
        
        account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
        accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()['Balance']
        targetBalance = None

        for balance in accountStates:
            if balance.currency == 'RSD':
                targetBalance = balance


        if targetBalance:
            targetBalance.amount += accountBalanceArgs['amount']
            db.session.add(targetBalance)
        else:
            newBalance = Balance(accountNumber=account.accountNumber, amount=accountBalanceArgs['amount'], currency='RSD')
            db.session.add(newBalance)
            
        db.session.commit()
        return 200 

api.add_resource(Account, "/accountBalance")