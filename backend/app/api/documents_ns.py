from flask_restx import Namespace, Resource

ns = Namespace("documents", description="Documents operations")

@ns.route("/")
class DocumentList(Resource):
    def get(self):
        """List all documents"""
        return {"message": "List of documents"}

    def post(self):
        """Create a new document"""
        return {"message": "Document created"}, 201
