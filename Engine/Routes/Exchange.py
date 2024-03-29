from Configuration.config import Resource, reqparse, api, activeTokens, db, make_response, jsonify
from Models.__init__ import User, Balance
from Configuration.currency import exchangeMoney

excArgs = reqparse.RequestParser()
excArgs.add_argument("oldCurrency", type=str, help="Old currency field is required", required=True)
excArgs.add_argument("newCurrency", type=str, help="New currency field is required", required=True)
excArgs.add_argument("oldValue", type=float, help="Old value field is required", required=True)

excArgs2 = reqparse.RequestParser()
excArgs2.add_argument("oldCurrency", type=str, help="Old currency field is required", required=True, location='args')
excArgs2.add_argument("newCurrency", type=str, help="New currency field is required", required=True, location='args')
excArgs2.add_argument("oldValue", type=float, help="Old value field is required", required=True, location='args')

class Exchange(Resource):
    """ Get checks value of exchange, post exchanges money """
    def get(self, token):
        try:
            args = excArgs2.parse_args()
            ret = exchangeMoney(args["oldValue"], args["oldCurrency"], args["newCurrency"])
            return make_response(jsonify({"value":ret}), 200)
        except Exception as e:
            return "Error: " + str(e), 400

    def post(self, token):
        try:
            args = excArgs.parse_args()
            if token not in activeTokens.keys():
                return "Please login to continue", 400
            email = activeTokens[token]

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()["User"]
            if not account:
                return "User doesnt exist!", 400

            if args["oldValue"] <= 0:
                return "Values must be greater 0", 400

            balances = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
            if not balances:
                return "You dont have any state", 400
            
            oldBalance, newBalance = None, None
            for b in balances:
                balance = b["Balance"]
                if balance.currency == args["oldCurrency"]:
                    oldBalance = balance
                elif balance.currency == args["newCurrency"]:
                    newBalance = balance

            if not oldBalance:
                return "You don't have any money in " + args["oldCurrency"], 400

            if oldBalance.amount < args["oldValue"]:
                return "You don't have enough money in " + args["oldCurrency"], 400

            if not newBalance:
                newBalance = Balance(account.accountNumber, 0, args["newCurrency"])
                db.session.add(newBalance)
            
            oldBalance.amount -= args["oldValue"]
            if oldBalance.amount == 0:
                db.session.delete(oldBalance)
            newBalance.amount += exchangeMoney(args["oldValue"], args["oldCurrency"], args["newCurrency"])
            db.session.commit()
            return "OK", 200
        except Exception as e:
            return "Error:" + str(e), 400

api.add_resource(Exchange, "/exchange/<string:token>")