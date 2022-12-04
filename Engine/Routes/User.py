from Configuration.config import *
from Models import User

userLoginArgs = reqparse.RequestParser()
userLoginArgs.add_argument("email", type=str, help="E mail is required", required=True)
userLoginArgs.add_argument("password", type=str, help="Password is required", required=True)

#User login
class Login(Resource):
    def post(self):
        db.create_all()
        args = userLoginArgs.parse_args()
        
        try:
            temp = User.query.filter_by(email=args['email'])
            if not temp:
                return "User doesnt exist!", 400
            else:
                if(temp.password != args['password']):
                    return "Invalid password", 400
                else:
                    session['user'] = temp
                    return jsonify(temp), 200
        except:
            return "Server failed", 500

api.add_resource(Login, "/login")

userRegistrationArgs = reqparse.RequestParser()
userRegistrationArgs.add_argument("firstName", type=str, help="First name is required", required=True)
userRegistrationArgs.add_argument("lastName", type=str, help="Last name is required", required=True)
userRegistrationArgs.add_argument("email", type=str, help="E mail is required", required=True)
userRegistrationArgs.add_argument("address", type=str, help="Address is required", required=True)
userRegistrationArgs.add_argument("city", type=str, help="City is required", required=True)
userRegistrationArgs.add_argument("phoneNumber", type=int, help="Phone number is required", required=True)
userRegistrationArgs.add_argument("password", type=str, help="Password is required", required=True)

#User register
class Register(Resource):
    def post(self):
        db.create_all()
        args = userRegistrationArgs.parse_args()

        temp = User.query.filter_by(email=args['email']).first()
        try:
            if temp:
                return "E mail is taken!", 404
        except:
            return "Server failed", 500

        user = User(firstName=args['firstName'], lastName=args['lastName'], 
        email=args['email'], address=args['address'], city=args['city'], 
        phoneNumber=args['phoneNumber'], password=args['password'], verified = False)        
        db.session.add(user)
        db.session.commit()
        return jsonify(user), 200

api.add_resource(Register, "/register")

#User profile get and put (change)
class User(Resource):
    def get(self):
        return "user-get"
    
    def put(self):
        return "user-put"

api.add_resource(User, "/user")