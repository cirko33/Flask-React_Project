from Configuration.config import Resource, reqparse, api, activeTokens, db
from Models.__init__ import User, Balance

excArgs = reqparse.RequestParser()
excArgs.add_argument("oldCurrency", type=str, help="Old currency field is required", required = True)
excArgs.add_argument("newCurrency", type=str, help="New currency field is required", required = True)
excArgs.add_argument("oldValue", type=float, help="Old value field is required", required = True) #subtract from old value of old currency
excArgs.add_argument("newValue", type=float, help="New value field is required", required = True) #add to old value of new currency

class Exchange(Resource):
    def post(self, token):
        try:
            args = excArgs.parse_args()
            if token not in activeTokens.keys():
                return "Please login to continue", 404
            email = activeTokens[token]

            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()["User"]
            if not account:
                return "User doesnt exist!", 400

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
            newBalance.amount += args["newValue"]
            db.session.commit()
            return "OK", 200
        except Exception as e:
            return "Error:" + str(e), 500

api.add_resource(Exchange, "/exchange/<string:token>")