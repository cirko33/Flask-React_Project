from Configuration.config import *
from flask_restful import Resource
from Models.__init__ import CreditCard, User, Balance

cardArgs = reqparse.RequestParser()
cardArgs.add_argument("cardNumber", type=str, help="Card Number is required", required=True)
cardArgs.add_argument("expirationDate", type=str, help="Date is required", required=True)
cardArgs.add_argument("cvc", type=int, help="CVC is required", required=True)
cardArgs.add_argument("userName", type=str, help="Name and surname are required", required=True)
cardArgs.add_argument("USDInRSD", type=float, required=True)

#Credit card post (adding credit card)
class Card(Resource):
    #Verification
    def post(self, token):
        """ Verification of the card for a given user (token) """
        args = cardArgs.parse_args()
        cardNumber, expirationDate, cvc, userName, USDInRSD = \
            args['cardNumber'], args['expirationDate'], args['cvc'], args['userName'], args['USDInRSD'],

        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 400
            email = activeTokens[token]

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
            if account.cardNumber is not None:
                return "You already have a credit card", 400
                
            card = db.session.execute(db.select(CreditCard).filter_by(cardNumber=cardNumber, expirationDate=expirationDate, cvc=cvc, userName=userName)).one_or_none()['CreditCard']
            if not card:
                return "Card does not exist", 404
            if card.amount < USDInRSD:
                return "You don't have enough money on your card", 400

            card.amount -= USDInRSD
            account.verified = True
            account.cardNumber = cardNumber
            db.session.add(Balance(account.accountNumber, 0, "RSD"))
            db.session.commit()
            return "OK", 200
        except Exception as e:
            return "Error: " + str(e), 500

api.add_resource(Card, "/card/<string:token>")