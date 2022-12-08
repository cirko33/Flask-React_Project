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
        args = accountBalanceAddingArgs.parse_args()

        if token not in activeTokens.keys():
            return "For this action, please login to your account", 404

        email = activeTokens[token]
        account = db.session.execute(db.select(Account).filter_by(userEmail=email)).one_or_none()
        if not account:
            return "Error, no account found", 404

        accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
        if not accountStates:
            return "Error: No balance on this account", 404

        balanceFound = False
        for balance in accountStates:
            if balance.currency == args["currency"]:
                balanceFound = True
                amount = args["amount"]
                if balance.amount < amount:
                    return "You dont have enough money!", 404
                    
                type = args["type"]
                if (type == 1): #to online account
                    accountToSend = db.session.execute(db.select(Account).filter_by(accountNumber=args["number"])).one_or_none()
                    if not accountToSend:
                        return "Account where you sent money does not exist", 404
                    
                    existingBalance = db.session.execute(db.select(Balance).filter_by(accountNumber=args["number"])).one_or_none()
                    if not existingBalance:
                        newBalance = Balance(accountNumber=args["number"], accountAmount=args["amount"], currency=args["currency"])
                        db.session.add(newBalance)
                    else:
                        existingBalance.amount += amount
                    
                    balance.amount -= amount
                elif (type == 2): #to bank account, cant check if exists
                    balance.amount -= amount
                else:
                    return "Error!", 404
                
        if not balanceFound:
            return "You don't have enough money", 404

        db.session.commit()
        return 200

api.add_resource(AccountBalance, "/accountBalance")