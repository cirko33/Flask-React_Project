from multiprocessing import Process, Queue
from threading import Thread
from Processing.thread import *

# Dictionary with tokens and process ids (?)
activeProcesses = {}
        
def processWorker(q: Queue):
    """ Process function that opens Thread if transaction is active """
    while True:
        if q.qsize() == 0:
            sleep(0.1)
            continue
        
        (email, receiver, amount, currency, type), ipAddress = q.get()
        Thread(target=threadWorker, args=(email, receiver, amount, currency, type, ipAddress)).join()

def openProcess(token, ipAddress):
    """ Opens a new process for given user (token) """
    q = Queue()
    temp = Process(target=processWorker, args=[q])
    temp.start()
    activeProcesses[token] = (temp, q, ipAddress)

def closeProcess(token):
    """ Closes the process for the given token (user) """
    if not activeProcesses[token]:
        print("ERROR: Process is not active")

    process, queue, ipAddress = activeProcesses.pop(token)
    process.terminate()
    
def addTransaction(token, transaction: tuple):
    """ Adds a transaction to the process queue """
    if not activeProcesses[token]:
        print("ERROR: Process is not active")
        
    process, queue, ipAddress = activeProcesses[token]
    queue.put(transaction, ipAddress)

