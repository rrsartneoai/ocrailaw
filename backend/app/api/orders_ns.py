from flask_restx import Namespace, Resource

ns = Namespace("orders", description="Orders operations")

@ns.route("/")
class OrderList(Resource):
    def get(self):
        """List all orders"""
        return {"message": "List of orders"}

    def post(self):
        """Create a new order"""
        return {"message": "Order created"}, 201
