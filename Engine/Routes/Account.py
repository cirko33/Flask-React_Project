from Configuration.config import *
from flask_restful import Resource
from Models.__init__ import Account

#Account
class AccountProfile(Resource):
    '''
    Account profile get (get profile by email) and post (post profile) ?
    '''
    def get(self, email):
        temp = db.session.execute(db.select(Account).filter_by(userEmail=email)).one_or_none()
        if not temp:
            return "User with this email does not own any cards", 404
        else:
            return jsonify(temp), 200

api.add_resource(AccountProfile, "/accountProfile")

#Account balance get and post (withdraw of money)
class AccountBalance(Resource):
    def get(self, number):
        temp = db.session.execute(db.select(Account).filter_by(accountNumber=number)).one_or_none()
        if not temp:
            return "Account with this number doesn't exist", 404
        else:
            return temp.amount, 200
    
    def post(self, number, value, type):
        temp = db.session.execute(db.select(Account).filter_by(accountNumber=number)).one_or_none()
        if (type == 1): #deposit
            temp.amount += value
        elif (type == 2): #withdraw
            if value > temp.amount:
                return "You dont have enought money!", 404
            else:
                temp.amount -= value 
        else:
            return "Error!", 404
        
        db.session.commit()
        return 200

api.add_resource(AccountBalance, "/accountBalance")