from Models.User import User
from Configuration.config import api, db, reqparse, Resource, activeTokens, createToken, jsonify, make_response
from datetime import datetime

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
            else:
                password = createToken(args['password'])
                if(temp.password != password):
                    return "Invalid password", 400
                else:
                    token = createToken(args['email'], str(datetime.now().timestamp()))
                    activeTokens[token] = args['email']
                    result = {
                        "token": token
                    }
                    return make_response(jsonify(result), 200)
        except Exception as e:
            return f"Server failed {str(e)}", 500

api.add_resource(Login, "/login")