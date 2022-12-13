from Configuration.config import db
from marshmallow import Schema, fields

class User(db.Model):
    __tablename__ = 'user'
    email = db.Column(db.String(64), unique=True) 
    password = db.Column(db.String(64))
    firstName = db.Column(db.String(32))
    lastName = db.Column(db.String(32))
    address = db.Column(db.String(64))
    city = db.Column(db.String(32))
    phoneNumber = db.Column(db.Integer)
    verified = db.Column(db.Boolean, default=False)
    accountNumber = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cardNumber = db.Column(db.String(20))

    def __init__(self, firstName, lastName, address, city, phoneNumber, email, password, verified):
        self.firstName = firstName
        self.lastName = lastName
        self.address = address
        self.city = city
        self.phoneNumber = phoneNumber
        self.email = email
        self.password = password
        self.verified = verified #kad se kreira novi automatski staviti na false??

class UserSchema(Schema):
    email = fields.Str() #id
    password = fields.Str()
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()
    city = fields.Str()
    phoneNumber = fields.Number()
    verified = fields.Boolean()
    accountNumber = fields.Number()
    cardNumber = fields.Str()