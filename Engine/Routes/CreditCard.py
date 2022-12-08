from Configuration.config import *
from flask_restful import Resource
from Models.__init__ import CreditCard, Account, User

creditCardAddingArgs = reqparse.RequestParser()
creditCardAddingArgs.add_argument("cardNumber", type=int, help="Card Number is required", required=True)
creditCardAddingArgs.add_argument("expirationDate", type=str, help="Date is required", required=True)
creditCardAddingArgs.add_argument("cvc", type=int, help="CVC is required", required=True)

#Credit card get and post (adding credit card)
class Card(Resource):
    def get(self, data):
        if isinstance(data, int):
            temp = db.session.execute(db.select(CreditCard).filter_by(cardNumber=data)).one_or_none()
            if not temp:
                return "Card with this number doesn't exist", 404
            else:
                return jsonify(temp), 200
        else:
            temp = db.session.execute(db.select(CreditCard).filter_by(userEmail=data)).one_or_none()
            if not temp:
                return "User with this email does not own any cards", 404
            else:
                return jsonify(temp), 200
    
    #Verifikacija
    def post(self, dataEmail):
        args = creditCardAddingArgs.parse_args()
        
        try:
            card = db.session.execute(db.select(CreditCard).filter_by(userEmail=dataEmail)).one_or_none()
            if not card:
                return "You don't have any credit card!", 404
        except:
            return "Server failed", 500

        if(card.cardNumber == args['cardNumber'] and card.cvc == args['cvc'] and card.expirationDate == args['expirationDate']):
            account = Account(userEmail=dataEmail, cardNumber = args['cardNumber'])
            card.amount -= 111
            user = User.query.filter_by(email=dataEmail).first()
            user.verified = True
            db.session.add(account)
            db.session.add(card)
            db.session.commit()
            return jsonify(account), 200
        else:
            return "Invalid card data! Please try again!", 404

api.add_resource(Card, "/card")

#Credit card balance get and post (withdraw of money)
class CardBalance(Resource):
    def get(self, card_number):
        temp =  db.session.execute(db.select(CreditCard).filter_by(cardNumber=card_number)).one_or_none()
        if not temp:
            return "Card with this number doesn't exist", 404
        else:
            return temp.amount, 200
    
    def post(self, card_number, value):
        temp =  db.session.execute(db.select(CreditCard).filter_by(cardNumber=card_number)).one_or_none()
        if value > temp.amount:
            return "You dont have enought money!", 404
        else:
            temp.amount -= value        
        
        db.session.commit()
        return 200

api.add_resource(CardBalance, "/cardBalance")