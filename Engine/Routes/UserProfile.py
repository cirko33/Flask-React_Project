from Configuration.config import reqparse, api, db, jsonify, Resource
from Models import User

userUpdateArgs = reqparse.RequestParser()
userUpdateArgs.add_argument("firstName", type=str)
userUpdateArgs.add_argument("lastName", type=str)
userUpdateArgs.add_argument("email", type=str)
userUpdateArgs.add_argument("address", type=str)
userUpdateArgs.add_argument("city", type=str)
userUpdateArgs.add_argument("phoneNumber", type=int)
userUpdateArgs.add_argument("password", type=str)

#User profile get and put (change)
class UserProfile(Resource):
    def patch(self, user_email):
        args = userUpdateArgs.parse_args()
        try:
            temp = User.query.filter_by(email=user_email).first()
            if not temp:
                return "User with this email doesn't exist", 404          

            #if firstName in args && args['firstName'] not None === args['firstName']
            if args['firstName']: 
                temp.firstName = args['firstName']
            if args['lastName']: 
                temp.lastName = args['lastName']
            if args['email']: 
                temp.email = args['email']
            if args['address']: 
                temp.address = args['address']
            if args['city']: 
                temp.city = args['city']
            if args['phoneNumber']:
                temp.phoneNumber = args['phoneNumber']
            if args['password']: 
                temp.password = args['password']

            db.session.commit()
            return jsonify(temp), 200
        except:
            return "Server failed", 500

api.add_resource(UserProfile, "/user")