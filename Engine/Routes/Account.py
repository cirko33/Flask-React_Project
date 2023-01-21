from Configuration.config import *
from flask_restful import Resource, reqparse
from Engine.Models import CreditCard
from Models.__init__ import User, Balance, BalanceSchema

#Account
accountBalanceArgs = reqparse.RequestParser()
accountBalanceArgs.add_argument("amount", type=float, help="Value is required", required=True)

#Account balance get and post (withdraw of money)
class Account(Resource):
    def get(self, token):
        """ Get balance for a given user (token) """
        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 400
            email = activeTokens[token]

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
            if not account:
                return "Error, no account found", 404
            if not account.verified:
                return "Please verify first", 400

            balances = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
            if not balances:
                return "Account doesn't have any balance", 400

            list = []
            balance_schema = BalanceSchema()
            for balance in balances:
                result = balance_schema.dump(balance["Balance"])
                list.append(result)                    
            return make_response(jsonify(list), 200)
        except Exception as e:
            return "Error: " + str(e), 400
    
    def post(self, token): 
        """ Deposit from credit card to account"""
        args = accountBalanceArgs.parse_args()
        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 400
            email = activeTokens[token]

            if args["amount"] <= 0:
                return "Amount must be greater than 0", 400

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
            if not account:
                return "Error, no account found", 404
            if not account.verified:
                return "Please verify first", 400

            accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
            targetBalance = None            

            for balance in accountStates:  
                if balance["Balance"].currency == 'RSD':                    
                    targetBalance = balance["Balance"]            
            
            amount = args['amount']            
            if targetBalance:
                card = db.session.execute(db.select(CreditCard).filter_by(cardNumber=account.cardNumber)).one_or_none()["CreditCard"]
                if card.amount < amount:
                    return "You don't have enough money on credit card", 400
                card.amount -= amount
                targetBalance.amount += amount
                db.session.commit()
                return "OK", 200
            else:
                return "Error", 400 
        except Exception as e:
            return "Error: " + str(e), 400

api.add_resource(Account, "/accountBalance/<string:token>")