from Configuration.config import *
from flask_restful import Resource

accountAddingArgs = reqparse.RequestParser()
accountAddingArgs.add_argument("userEmail", type=str, help="User email is required", required=True)

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
        account = Account(userEmail=args['userEmail'])
        #pozvati get za karticu da se skine 1$ za kreiranje racuna 
        db.session.add(account)
        db.session.commit()
        return jsonify(account), 200

api.add_resource(Account, "/account")