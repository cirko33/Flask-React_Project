from Configuration.config import *
from flask_restful import Resource
from Models import *

creditCardAddingArgs = reqparse.RequestParser()
creditCardAddingArgs.add_argument("cardNumber", type=int, help="Card Number is required", required=True)
creditCardAddingArgs.add_argument("userName", type=str, help="user name is required", required=True)
creditCardAddingArgs.add_argument("expirationDate", type=str, help="Date is required", required=True)
creditCardAddingArgs.add_argument("cvc", type=int, help="CVC is required", required=True)
creditCardAddingArgs.add_argument("userEmail", type=str, help="user email is required", required=True)
creditCardAddingArgs.add_argument("amount", type=float, help="amount is required", required=True)

#Credit card get and post (adding credit card)
class Card(Resource):
    def get(self, data):
        if isinstance(data, int):
            temp = CreditCard.query.filter_by(cardNumber=data).first()
            if not temp:
                return "Card with this number doesn't exist", 404
            else:
                return jsonify(temp), 200
        else:
            temp = CreditCard.query.filter_by(userEmail=data).first()
            if not temp:
                return "User with this email does not own any cards", 404
            else:
                return jsonify(temp), 200
    
    #Verifikacija
    def post(self):
        args = creditCardAddingArgs.parse_args()
        
        try:
            temp = CreditCard.query.filter_by(cardNumber=args['cardNumber']).first()
            if temp:
                return "Card with this number already exists!", 404
        except:
            return "Server failed", 500

        card = CreditCard(cardNumber=args['cardNumber'], userName=args['userName'], 
        expirationDate=args['expirationDate'], cvc=args['cvc'], userEmail=args['userEmail'], amount=args["amount"])        
        db.session.add(card)
        db.session.commit()
        return jsonify(card), 200

api.add_resource(Card, "/card")

#Credit card balance get and post (withdraw of money)
class CardBalance(Resource):
    def get(self, card_number):
        temp = CreditCard.query.filter_by(cardNumber=card_number).first()
        if not temp:
            return "Card with this number doesn't exist", 404
        else:
            return temp.amount, 200
    
    def post(self, card_number, value):
        temp = CreditCard.query.filter_by(cardNumber=card_number).first()
        if value > temp.amount:
            return "You dont have enought money!", 404
        else:
            temp.amount -= value        
        
        db.session.commit()
        return 200

api.add_resource(CardBalance, "/cardBalance")