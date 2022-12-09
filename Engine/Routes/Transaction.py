from Configuration.config import api, jsonify, db, activeTokens
from flask_restful import Resource
from Models.__init__ import Transaction, Balance, Account
from Configuration.config import reqparse

transactionMakingArgs = reqparse.RequestParser();
transactionMakingArgs.add_argument("sender", type=str)
transactionMakingArgs.add_argument("receiver", type=str, help="Receiver (User email or account number) is required", required = True)
transactionMakingArgs.add_argument("amount", type=float, help="Amount can't be 0 and it's required", required = True)

#Transaction get (history) and post (making new transaction)
class TransactionProfile(Resource):
    def get(self, userEmail):
        transactionSender =  db.session.execute(db.select(Transaction).filter_by(sender=userEmail)).all()
        transactionReceiver = db.session.execute(db.select(Transaction).filter_by(receiver=userEmail)).all()
        transaction = transactionSender + transactionReceiver
        
        if transaction:
            return jsonify(transaction), 200
        else:
            return "You don't have any transaction.", 400
    
    def post(self, token):
        #U skladu sa izmenama modela i dogovora implementacije izmeniti kod
        args = transactionMakingArgs.parse_args()

        if token not in activeTokens.keys():
            addTransaction(activeTokens[token], args["receiver"], args["amount"], "Denied")
            return "For this action, please login to your account", 404

        email = activeTokens[token]
        account = db.session.execute(db.select(Account).filter_by(userEmail=email)).one_or_none()
        if not account:
            addTransaction(email, args["receiver"], args["amount"], "Denied")
            return "Error, no account found", 404

        accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
        if not accountStates:
            addTransaction(email, args["receiver"], args["amount"], "Denied")
            return "Error: No balance on this account", 404

        balanceFound = False
        receiver = None

        for balance in accountStates:
            if balance.currency == args["currency"]:
                balanceFound = True
                amount = args["amount"]
                if balance.amount < amount:
                    addTransaction(email, args["receiver"], args["amount"], "Denied")
                    return "You dont have enough money!", 404
                    
                type = args["type"]
                if (type == 1): #to online account
                    accountToSend = db.session.execute(db.select(Account).filter_by(accountNumber=args["number"])).one_or_none()
                    if not accountToSend:
                        addTransaction(email, args["receiver"], args["amount"], "Denied")
                        return "Account where you sent money does not exist", 404
                    
                    receiver = accountToSend.userEmail;
                    existingBalance = db.session.execute(db.select(Balance).filter_by(accountNumber=args["number"])).one_or_none()
                    if not existingBalance:
                        newBalance = Balance(accountNumber=args["number"], accountAmount=args["amount"], currency=args["currency"])
                        db.session.add(newBalance)
                    else:
                        existingBalance.amount += amount
                    
                    balance.amount -= amount
                elif (type == 2): #to bank account, cant check if exists
                    balance.amount -= amount
                else:
                    addTransaction(email, args["receiver"], args["amount"], "Denied")
                    return "Error!", 404
                
        if not balanceFound:
            addTransaction(email, args["receiver"], args["amount"], "Denied")
            return "You don't have enough money", 404

        db.session.commit()
        addTransaction(email, receiver, args["amount"], "U obradi")
        return 200

api.add_resource(TransactionProfile, "/transaction")

def addTransaction(sender, receiver, amaount, state):
    transaction = Transaction(sender, receiver, amaount, state)
    db.session.add(transaction)
    db.session.commit()
