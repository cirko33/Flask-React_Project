from Configuration.config import reqparse, api, db, jsonify, Resource, activeTokens
from Models.User import User

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
    
    def patch(self, token):
        args = userUpdateArgs.parse_args()
        try:
            if token not in activeTokens.keys():
                return "Please login to continue.", 404

            account = db.session.execute(db.select(User).filter_by(email=activeTokens[token])).one_or_none()['User']
            if not account:
                return "User with this email doesn't exist", 404          

            #if firstName in args && args['firstName'] not None === args['firstName']
            if args['firstName']: 
                account.firstName = args['firstName']
            if args['lastName']: 
                account.lastName = args['lastName']
            if args['email']: 
                account.email = args['email']
            if args['address']: 
                account.address = args['address']
            if args['city']: 
                account.city = args['city']
            if args['phoneNumber']:
                account.phoneNumber = args['phoneNumber']
            if args['password']: 
                account.password = args['password']

            db.session.commit()
            return jsonify(account), 200
        except:
            return "Server failed", 500

api.add_resource(UserProfile, "/userProfile")