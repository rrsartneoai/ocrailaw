from flask_restx import Namespace, Resource

ns = Namespace("payments", description="Payments operations")

@ns.route("/")
class PaymentList(Resource):
    def get(self):
        """List all payments"""
        return {"message": "List of payments"}

    def post(self):
        """Create a new payment"""
        return {"message": "Payment created"}, 201
