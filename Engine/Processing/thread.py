import sys
from time import sleep
from Configuration.config import db, sendingSocket, app
from Models.__init__ import Transaction, User, Balance
from threading import Lock

mutex = Lock()

def threadWorker(email, receiver, amount, currency, type, ipAddress):
    """ Represents a thread for processing transaction """
    def addTransaction(sender, receiver, amount, currency, state, type):
        print("Pozvan sam !!!!", sys.stderr)
        with app.app_context():
            transaction = Transaction(sender, receiver, amount, currency, state, type)
            db.session.add(transaction)
            db.session.commit()
        sendingSocket.sendto(b"Update", (ipAddress, 5001))
        return transaction

    def changeTransactionState(transaction, state):
        if not transaction:
            return
        with app.app_context():
            transaction = db.session.merge(transaction)
            db.session.execute(db.select(Transaction).filter_by(sender=transaction.sender, receiver = transaction.receiver, amount = transaction.amount, currency = transaction.currency, state = "In progress", type = transaction.type).order_by(Transaction.id)).scalars().first()
            transaction.state = state
            db.session.commit()
        sendingSocket.sendto(b"Update", (ipAddress, 5001))

    transaction = None
    try:
        print("Starting thread...", sys.stderr)
        transaction = addTransaction(email, receiver, amount, currency, "In progress", type) 
        sleep(10)
        print("Starting money exchange...", sys.stderr)
        with app.app_context():
            account = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()['User']
            if not account:
                raise Exception("")

            balance = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber, currency=currency)).one_or_none()
            if not balance:
                raise Exception("")

            balance = balance["Balance"]
            if balance.amount < amount:
                raise Exception("")

            if type == "online": #to online 
                accountReceiver = db.session.execute(db.select(User).filter_by(email=receiver)).one_or_none()['User']
                if not accountReceiver or not accountReceiver.verified:
                    raise Exception("")

                receiverNumber = accountReceiver.accountNumber
                receiverBalance = db.session.execute(db.select(Balance).filter_by(accountNumber=receiverNumber, currency=currency)).one_or_none()
                if not receiverBalance:
                    receiverBalance = Balance(receiverNumber, amount, currency)
                    db.session.add(receiverBalance)
                else:
                    receiverBalance["Balance"].amount += amount

            balance.amount -= amount
            if balance.amount == 0:
                db.session.delete(balance)
            db.session.commit()

        changeTransactionState(transaction, "Accepted")
    except:
        changeTransactionState(transaction, "Denied")
        return