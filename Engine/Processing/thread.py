import sys
from time import sleep
from Configuration.config import db, sendingSocket
from Models.__init__ import Transaction, User, Balance
from threading import Lock

mutex = Lock()

def threadWorker(email, receiver, amount, currency, type, ipAddress):
    """ Represents a thread for processing transaction """
    def addTransaction(sender, receiver, amount, currency, state, type):
        transaction = Transaction(sender, receiver, amount, currency, state, type)
        db.session.add(transaction)
        db.session.commit()
        sendingSocket.sendto(b"Update", (ipAddress, 5001))
        return transaction

    def changeTransactionState(transaction, state):
        transaction.state = state
        db.session.commit()
        sendingSocket.sendto(b"Update", (ipAddress, 5001))
        mutex.release()

    try:
        print("Starting thread...", sys.stderr)
        transaction = addTransaction(email, receiver, amount, currency, "In progress", type) 
        sleep(10)
        print("Starting money exchange...", sys.stderr)
        account = db.session.execute(db.select(User).filter_by(userEmail=email)).one_or_none()['User']
        if not account:
            changeTransactionState(transaction, "Denied")
            return

        mutex.acquire()
        accountStates = db.session.execute(db.select(Balance).filter_by(accountNumber=account.accountNumber)).scalars().all()
        if not accountStates:
            changeTransactionState(transaction, "Denied")
            return

        balanceFound = False
        for balance in accountStates:
            if balance.currency != currency:
                continue

            balanceFound = True
            if balance.amount < amount:
                changeTransactionState(transaction, "Denied")
                return

            if type == "online": #to online 
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
            elif type == "bank": #to bank (SIKIMI RADI)
                balance.amount -= amount
                changeTransactionState(transaction, "Accepted")
                return

        if not balanceFound:
            changeTransactionState(transaction, "Denied")
            return
    except:
        changeTransactionState(transaction, "Denied")
        return