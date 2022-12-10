from flask import Flask, session, jsonify
from flask_restful import Api, reqparse, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flaskext.mysql import MySQL
import socket, hashlib

app = Flask(__name__)

hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname).split('.')
hostbase = f"{ip_address[0]}.{ip_address[1]}.{ip_address[2]}"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:Drs_2022@{hostbase}.1:9000/drsdb'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Drs_2022'
app.config['MYSQL_DATABASE_DB'] = 'drsdb'
app.config['MYSQL_DATABASE_HOST'] = f'{hostbase}.1:9000'

api = Api(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
mysql = MySQL(app)

activeTokens = { }

def createToken(text, end="_qw3efdsfg1"):
    textToHash = text + end
    return hashlib.sha256(textToHash.encode("utf8")).hexdigest()