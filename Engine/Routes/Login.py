from Models.User import User
from Configuration.config import api, db, reqparse, Resource, activeTokens, createHash, jsonify, make_response
from datetime import datetime
from flask import request
from Processing.__init__ import openProcess

userLoginArgs = reqparse.RequestParser()
userLoginArgs.add_argument("email", type=str, help="Email is required", required=True)
userLoginArgs.add_argument("password", type=str, help="Password is required", required=True)

#User login
class Login(Resource):
    def post(self):
        args = userLoginArgs.parse_args()
        try:
            temp = db.session.execute(db.select(User).filter_by(email=args["email"])).one_or_none()["User"] #po ovome izvlaciti modele iz baze
            if not temp:
                return "User doesnt exist!", 400

            password = createHash(args['password'])
            if(temp.password != password):
                return "Invalid password", 400

            if args["email"] in activeTokens.values():
                for key in activeTokens:
                    if activeTokens[key] == args["email"]:
                        return make_response(jsonify({"token": key}), 200)
                return "User already logged in", 400

            token = createHash(args['email'], str(datetime.now().timestamp()))
            activeTokens[token] = args['email']
            
            openProcess(token, request.remote_addr)
            return make_response(jsonify({"token": token}), 200)
        except Exception as e:
            return "Error:" + str(e), 500

api.add_resource(Login, "/login")