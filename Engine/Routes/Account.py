from Configuration.config import *
from flask_restful import Resource
from Models import *

accountAddingArgs = reqparse.RequestParser()
accountAddingArgs.add_argument("userEmail", type=str, help="User email is required", required=True)
accountAddingArgs.add_argument("cardNumber", type=int)

#Account
class Account(Resource):
    def get(self, email):
        temp = Account.query.filter_by(userEmail=email).first()
        if not temp:
            return "User with this email does not own any cards", 404
        else:
            return jsonify(temp), 200

    def post(self):
        args = accountAddingArgs.parse_args()
        account = Account(userEmail=args['userEmail'], cardNumber = args['cardNumber'])
        card = CreditCard.query.filter_by(cardNumber = args['cardNumber'])
        card.amount - 111; 
        db.session.add(account)
        db.session.add(card)
        db.session.commit()
        return jsonify(account), 200

api.add_resource(Account, "/account")

#Account balance get and post (withdraw of money)
class AccountBalance(Resource):
    def get(self, number):
        temp = Account.query.filter_by(accountNumber=number).first()
        if not temp:
            return "Account with this number doesn't exist", 404
        else:
            return temp.amount, 200
    
    def post(self, number, value, type):
        temp = Account.query.filter_by(accountNumber=number).first()
        if (type == 1): #deposit
            temp.amount += value
        elif (type == 2): #withdraw
            if value > temp.amount:
                return "You dont have enought money!", 404
            else:
                temp.amount -= value 
        else:
            return "Error!", 404
        
        db.session.commit()
        return 200

api.add_resource(AccountBalance, "/accountBalance")