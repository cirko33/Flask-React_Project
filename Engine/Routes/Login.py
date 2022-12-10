from Models.User import User
from Configuration.config import api, db, jsonify, reqparse, Resource, session, activeTokens
from datetime import datetime
import hashlib

userLoginArgs = reqparse.RequestParser()
userLoginArgs.add_argument("email", type=str, help="Email is required", required=True)
userLoginArgs.add_argument("password", type=str, help="Password is required", required=True)

#User login
class Login(Resource):
    def post(self):
        args = userLoginArgs.parse_args()
        
        try:
            temp = db.session.execute(db.select(User).filter_by(id=args["email"])).one_or_none()["User"] #po ovome izvlaciti modele iz baze
            if not temp:
                return "User doesnt exist!", 400
            else:
                password = hashlib.sha256((args['password'] + "_qw3efdsfg1").encode("utf8")).hexdigest()
                if(temp.password != password):
                    return "Invalid password", 400
                else:
                    token = hashlib.sha256((args['email'] + str(datetime.now().timestamp())).encode("utf8")).hexdigest()
                    activeTokens[token] = args['email']
                    return token, 200
        except Exception as e:
            return f"Server failed {str(e)}", 500

api.add_resource(Login, "/login")