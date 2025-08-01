from flask_restx import Namespace, Resource, fields
from flask import request
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token

ns = Namespace("auth", description="Authentication Operations")

register_model = ns.model(
    "Register", {
        "email": fields.String(required=True),
        "password": fields.String(required=True),
        "full_name": fields.String()
    }
)

login_model = ns.model(
    "Login", {
        "email": fields.String(required=True),
        "password": fields.String(required=True)
    }
)

@ns.route("/register")
class Register(Resource):
    @ns.expect(register_model)
    def post(self):
        data = request.json
        if User.query.filter_by(email=data["email"]).first():
            ns.abort(400, "Email already registered")
        user = User(email=data["email"], full_name=data.get("full_name"))
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return {"message": "Registered successfully."}, 201

@ns.route("/login")
class Login(Resource):
    @ns.expect(login_model)
    def post(self):
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not user.check_password(data["password"]):
            ns.abort(401, "Invalid credentials")
        token = create_access_token(identity=user.id)
        return {"access_token": token}
