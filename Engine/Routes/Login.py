from Models.User import User
from Configuration.config import api, db, jsonify, reqparse, Resource, session

userLoginArgs = reqparse.RequestParser()
userLoginArgs.add_argument("email", type=str, help="E mail is required", required=True)
userLoginArgs.add_argument("password", type=str, help="Password is required", required=True)

#User login
class Login(Resource):
    def post(self):
        db.create_all()
        args = userLoginArgs.parse_args()
        
        try:
            temp = db.session.execute(db.select(User).filter_by(email=args["email"])).one_or_none()
            if not temp:
                return "User doesnt exist!", 400
            else:
                if(temp.password != args['password']):
                    return "Invalid password", 400
                else:
                    session['user'] = temp
                    return jsonify(temp), 200
        except Exception as e:
            return f"Server failed {str(e)}", 500

api.add_resource(Login, "/login")