from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_mysqldb import MySQL

app = Flask(__name__)
api = Api(app)
db = SQLAlchemy()
ma = Marshmallow()

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'drs'
app.config['MYSQL_DATABASE_PASSWORD'] = 'drs22'
app.config['MYSQL_DATABASE_DB'] = 'drsdb'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app);

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://drs:drs22@localhost/drsdb'

db.init_app(app)
ma.init_app(app)