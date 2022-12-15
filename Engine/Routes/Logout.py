from Configuration.config import api, Resource, activeTokens
from Processing.__init__ import closeProcess

#User logout
class Logout(Resource):
    def post(self, token):
        try:
            closeProcess(token)
            activeTokens.pop(token)
            return 200
        except Exception as e:
            return f"Error: {str(e)}", 500

api.add_resource(Logout, "/logout/<string:token>")