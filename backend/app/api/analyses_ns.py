from flask_restx import Namespace, Resource

ns = Namespace("analyses", description="Analyses operations")

@ns.route("/")
class AnalysisList(Resource):
    def get(self):
        """List all analyses"""
        return {"message": "List of analyses"}

    def post(self):
        """Create a new analysis"""
        return {"message": "Analysis created"}, 201
