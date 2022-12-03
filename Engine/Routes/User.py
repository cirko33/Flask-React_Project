from Configuration.config import api
from flask_restful import Resource

#User login
class Login(Resource):
    def post(self):
        return "login-post"

api.add_resource(Login, "/login")

#User register
class Register(Resource):
    def post(self):
        return "register-post"

api.add_resource(Register, "/register")

#User profile get and put (change)
class User(Resource):
    def get(self):
        return "user-get"
    
    def put(self):
        return "user-put"

api.add_resource(User, "/user")