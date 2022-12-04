from Configuration.config import *
from Models import User

#User login
class Login(Resource):
    def post(self):
        return "login-post"

api.add_resource(Login, "/login")

userArgs = reqparse.RequestParser()
userArgs.add_argument("firstName", type=str, help="First name is required", required=True)
userArgs.add_argument("lastName", type=str, help="Last name is required", required=True)
userArgs.add_argument("email", type=str, help="E mail is required", required=True)
userArgs.add_argument("address", type=str, help="Address is required", required=True)
userArgs.add_argument("city", type=str, help="City is required", required=True)
userArgs.add_argument("phoneNumber", type=int, help="Phone number is required", required=True)
userArgs.add_argument("password", type=str, help="Password is required", required=True)

#User register
class Register(Resource):
    def post(self):
        db.create_all()
        args = userArgs.parse_args()
        
        temp = User.query.filter_by(email=userArgs['email']).first()
        if temp:
            abort(400, message="E mail is taken!")

        user = User(firstName=args['firstName'], lastName=args['lastName'], 
        email=args['email'], address=args['address'], city=args['city'], 
        phoneNumber=args['phoneNumber'], password=args['password'], verified = False)        
        db.session.add(user)
        db.session.commit()
        return "register-post"

api.add_resource(Register, "/register")

#User profile get and put (change)
class User(Resource):
    def get(self):
        return "user-get"
    
    def put(self):
        return "user-put"

api.add_resource(User, "/user")