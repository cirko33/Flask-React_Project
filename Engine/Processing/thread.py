from time import sleep
from Configuration.config import db
from Models.__init__ import Transaction, User, Balance

def threadWorker(email, receiver, amount, currency, type, ipAddress, mutex):
    """ Represents a thread for processing transaction """
    def addTransaction(sender, receiver, amount, currency, state):
        transaction = Transaction(sender, receiver, amount, currency, state)
        db.session.add(transaction)
        db.session.commit()
        mutex.acquire()
        return transaction

    def changeTransactionState(transaction, state):
        transaction.state = state
        db.session.commit()
        mutex.release()

    try:
        transaction = addTransaction(email, receiver, amount, "In progress") 
        sleep(10)

        account = db.session.execute(db.select(User).filter_by(userEmail=email)).one_or_none()['User']
        if not account:
            changeTransactionState(transaction, "Denied")
            return

        accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).all()
        if not accountStates:
            changeTransactionState(transaction, "Denied")
            return

        balanceFound = False
        for b in accountStates:
            balace = b['Balance']
            if balance.currency != currency:
                continue

            balanceFound = True
            if balance.amount < amount:
                changeTransactionState(transaction, "Denied")
                return

            if type == 1: #to online 
                accountReceiver = db.session.execute(db.select(User).filter_by(email=receiver)).one_or_none()['User']
                if not accountReceiver:
                    changeTransactionState(transaction, "Denied")
                    return
                
                receiverNumber = accountReceiver.accountNumber
                receiverBalance = db.session.execute(db.select(Balance).filter_by(email=receiverNumber, currency=currency)).one_or_none()['Balance']
                if not receiverBalance:
                    receiverBalance = Balance(receiverNumber, 0, currency)
                    db.session.add(receiverBalance)
                
                receiverBalance.amount += amount
                balance.amount -= amount
                changeTransactionState(transaction, "Accepted")
                return
            elif type == 2: #to bank (SIKIMI RADI)
                changeTransactionState(transaction, "Accepted")
                return

        if not balanceFound:
            changeTransactionState(transaction, "Denied")
            return
    except:
        changeTransactionState(transaction, "Denied")
        return