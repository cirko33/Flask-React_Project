from Configuration.config import api
from flask_restful import Resource

#Currency
class Currency(Resource):
    def get(self):
        return "currency-get"

    def post(self):
        return "currency-post"

api.add_resource(Currency, "/currency")

