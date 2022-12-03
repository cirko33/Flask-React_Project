from Configuration.config import api
from flask_restful import Resource

#Credit card get and post (adding credit card)
class Card(Resource):
    def get(self):
        return "card-get"
        
    def post(self):
        return "card-post"

api.add_resource(Card, "/card")

#Credit card balance get and post (withdraw of money)
class CardBalance(Resource):
    def get(self):
        return "card-balance-get"
    
    def post(self):
        return "card-balance-post"

api.add_resource(CardBalance, "/balance")

