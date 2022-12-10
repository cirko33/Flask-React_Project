from Configuration.config import *
from flask_restful import Resource
from Models.__init__ import CreditCard, User

creditCardAddingArgs = reqparse.RequestParser()
creditCardAddingArgs.add_argument("cardNumber", type=str, help="Card Number is required", required=True)
creditCardAddingArgs.add_argument("expirationDate", type=str, help="Date is required", required=True)
creditCardAddingArgs.add_argument("cvc", type=int, help="CVC is required", required=True)
creditCardAddingArgs.add_argument("userName", type=str, help="Name and surname are required", required=True)

#Credit card post (adding credit card)
class Card(Resource):
    #Verification
    def post(self, token, USDInRSD):
        args = creditCardAddingArgs.parse_args()
        cardNumber, expirationDate, cvc, userName = args['cardNumber'], args['ExpirationDate'], args['cvc'], args['userName']
        card = None
        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 404
            email = activeTokens[token]

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
            if account.cardNumber is not None:
                return "You already have a credit card", 404
                
            card = db.session.execute(db.select(CreditCard).filter_by(cardNumber=cardNumber, expirationDate=expirationDate, cvc=cvc, userName=userName))['CreditCard']
            if not card:
                return "Card does not exist", 404
            
            card.amount -= USDInRSD
            account.verified = True
            account.cardNumber = cardNumber
            db.session.commit()
            return 200
        except Exception as e:
            return "Server failed: " + str(e), 500

api.add_resource(Card, "/card")