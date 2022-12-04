from Configuration.config import db
from marshmallow import Schema, fields

class User(db.Model):
    __tablename__ = 'user'
    email = db.Column(db.String(64), primary_key=True)
    password = db.Column(db.String(64))
    firstName = db.Column(db.String(32))
    lastName = db.Column(db.String(32))
    address = db.Column(db.String(64))
    city = db.Column(db.String(32))
    phoneNumber = db.Column(db.Integer)
    verified = db.Column(db.Boolean, default=False)

    def __init__(self, firstName, lastName, address, city, phoneNumber, email, password, verified):
        self.firstName = firstName
        self.lastName = lastName
        self.address = address
        self.city = city
        self.phoneNumber = phoneNumber
        self.email = email
        self.password = password
        self.verified = verified

class UserSchema(Schema):
    email = fields.Str()
    password = fields.Str()
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()
    city = fields.Str()
    phoneNumber = fields.Number()
    verified = fields.Boolean()

