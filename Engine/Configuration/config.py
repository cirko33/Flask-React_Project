from flask import Flask, session, jsonify
from flask_restful import Api, reqparse, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flaskext.mysql import MySQL

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Drs_2022@172.24.0.1:9000/drsdb'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Drs_2022'
app.config['MYSQL_DATABASE_DB'] = 'drsdb'
app.config['MYSQL_DATABASE_HOST'] = '172.24.0.1:9000'

api = Api(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
mysql = MySQL(app)

