Backend Complete Implem
entation

1. backend/app/__init__.py
 copy
python

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.orders import orders_bp
    from app.api.documents import documents_bp
    from app.api.analyses import analyses_bp
    from app.api.payments import payments_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(analyses_bp)
    app.register_blueprint(payments_bp)

    # Register error handlers
    from app.utils.exceptions import register_error_handlers
    register_error_handlers(app)

    return app
 copy
2. backend/app/config.py
 copy
python

import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost:5432/document_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "backend/storage/order_docs")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
3. backend/app/models/user.py
 copy
python

from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship("Order", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"
4. backend/app/models/order.py
 copy
python

from datetime import datetime
from app import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    status = db.Column(db.String(50), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", back_populates="orders")
    documents = db.relationship("Document", back_populates="order", cascade="all, delete-orphan")
    analysis = db.relationship("Analysis", back_populates="order", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "documents": [doc.to_dict() for doc in self.documents],
            "analysis": self.analysis.to_dict() if self.analysis else None,
        }
 copy
5. backend/app/models/document.py
 copy
python

from datetime import datetime
from app import db

class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    storage_path = db.Column(db.String(1024), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship("Order", back_populates="documents")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "filename": self.filename,
            "storage_path": self.storage_path,
            "uploaded_at": self.uploaded_at.isoformat(),
        }
 copy
6. backend/app/models/analysis.py
 copy
python

from datetime import datetime
from app import db

class Analysis(db.Model):
    __tablename__ = "analyses"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False, unique=True)
    result = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship("Order", back_populates="analysis")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "result": self.result,
            "created_at": self.created_at.isoformat(),
        }
 copy
7. backend/app/api/auth.py
 copy
python

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from app import db
from app.models.user import User
from app.utils.exceptions import InvalidUsage
from app.utils.validators import validate_register_data, validate_login_data

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    validate_register_data(data)
    if User.query.filter_by(email=data["email"]).first():
        raise InvalidUsage("Email already registered", 400)
    user = User(
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        full_name=data.get("full_name"),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    validate_login_data(data)
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password_hash, data["password"]):
        raise InvalidUsage("Invalid email or password", status_code=401)
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise InvalidUsage("User not found", 404)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at.isoformat(),
    }), 200
 copy
8. backend/app/api/orders.py
 copy
python

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.order_service import OrderService
from app.utils.exceptions import InvalidUsage
from app.utils.validators import validate_order_data, validate_order_status

orders_bp = Blueprint("orders", __name__, url_prefix="/api/v1/orders")

@orders_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = OrderService.get_orders_by_user(user_id)
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route("", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    validate_order_data(data)
    order = OrderService.create_order(user_id, data)
    return jsonify(order.to_dict()), 201

@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = OrderService.get_order_by_id(order_id, user_id)
    if not order:
        raise InvalidUsage("Order not found", 404)
    return jsonify(order.to_dict()), 200

@orders_bp.route("/<int:order_id>/status", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    validate_order_status(data)
    order = OrderService.update_order_status(order_id, user_id, data["status"])
    if not order:
        raise InvalidUsage("Order not found or unauthorized", 404)
    return jsonify(order.to_dict()), 200

@orders_bp.route("/<int:order_id>/documents", methods=["POST"])
@jwt_required()
def upload_document(order_id):
    user_id = get_jwt_identity()
    if "file" not in request.files:
        raise InvalidUsage("File part missing", 400)
    file = request.files["file"]
    if file.filename == "":
        raise InvalidUsage("No selected file", 400)

    document = OrderService.add_document_to_order(order_id, user_id, file)
    return jsonify(document.to_dict()), 201
 copy
9. backend/app/services/order_service.py
 copy
python

import os
from werkzeug.utils import secure_filename
from app import db
from app.models.order import Order
from app.models.document import Document
from app.models.user import User
from app.config import Config

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class OrderService:

    @staticmethod
    def get_orders_by_user(user_id):
        return Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

    @staticmethod
    def create_order(user_id, data):
        order = Order(user_id=user_id, status="pending")
        db.session.add(order)
        db.session.commit()
        return order

    @staticmethod
    def get_order_by_id(order_id, user_id):
        return Order.query.filter_by(id=order_id, user_id=user_id).first()

    @staticmethod
    def update_order_status(order_id, user_id, new_status):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return None
        order.status = new_status
        db.session.commit()
        return order

    @staticmethod
    def add_document_to_order(order_id, user_id, file):
        order = OrderService.get_order_by_id(order_id, user_id)
        if not order:
            raise Exception("Order not found or unauthorized")

        if not allowed_file(file.filename):
            raise Exception("File type not allowed")

        filename = secure_filename(file.filename)
        upload_folder = os.path.join(Config.UPLOAD_FOLDER, str(order_id))
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        doc = Document(order_id=order_id, filename=filename, storage_path=filepath)
        db.session.add(doc)
        db.session.commit()
        return doc
 copy
10. backend/app/api/documents.py
 copy
python

from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.document_service import DocumentService
from app.utils.exceptions import InvalidUsage
import os

documents_bp = Blueprint("documents", __name__, url_prefix="/api/v1/documents")

@documents_bp.route("/<int:document_id>", methods=["GET"])
@jwt_required()
def get_document(document_id):
    user_id = get_jwt_identity()
    document = DocumentService.get_document_by_id(document_id, user_id)
    if not document or not os.path.exists(document.storage_path):
        raise InvalidUsage("Document not found", 404)
    return send_file(document.storage_path, as_attachment=True, download_name=document.filename)

@documents_bp.route("/<int:document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id):
    user_id = get_jwt_identity()
    success = DocumentService.delete_document(document_id, user_id)
    if not success:
        raise InvalidUsage("Document not found or unauthorized", 404)
    return jsonify({"message": "Document deleted"}), 200
 copy
11. backend/app/services/document_service.py
 copy
python

import os
from app import db
from app.models.document import Document
from app.models.order import Order

class DocumentService:

    @staticmethod
    def get_document_by_id(document_id, user_id):
        return (Document.query.join(Order)
                .filter(Document.id==document_id, Order.user_id==user_id)
                .first())

    @staticmethod
    def delete_document(document_id, user_id):
        document = DocumentService.get_document_by_id(document_id, user_id)
        if not document:
            return False
        if os.path.exists(document.storage_path):
            try:
                os.remove(document.storage_path)
            except:
                pass
        db.session.delete(document)
        db.session.commit()
        return True
 copy
12. backend/app/api/analyses.py
 copy
python

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.analysis_service import AnalysisService
from app.utils.exceptions import InvalidUsage
from app.utils.validators import validate_analysis_request

analyses_bp = Blueprint("analyses", __name__, url_prefix="/api/v1/analyses")

@analyses_bp.route("/orders/<int:order_id>/analysis", methods=["POST"])
@jwt_required()
def create_analysis(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    validate_analysis_request(data)
    analysis = AnalysisService.create_analysis(order_id, user_id, data)
    if not analysis:
        raise InvalidUsage("Order not found or unauthorized", 404)
    return jsonify(analysis.to_dict()), 201

@analyses_bp.route("/orders/<int:order_id>/analysis", methods=["GET"])
@jwt_required()
def get_analysis(order_id):
    user_id = get_jwt_identity()
    analysis = AnalysisService.get_analysis_by_order(order_id, user_id)
    if not analysis:
        raise InvalidUsage("Analysis not found", 404)
    return jsonify(analysis.to_dict()), 200
 copy
13. backend/app/services/analysis_service.py
 copy
python

from app import db
from app.models.analysis import Analysis
from app.models.order import Order

class AnalysisService:

    @staticmethod
    def create_analysis(order_id, user_id, data):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return None

        existing = Analysis.query.filter_by(order_id=order_id).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()

        # Replace this with real document analysis logic
        analysis_result = {
            "summary": "Analysis completed",
            "details": data.get("details", {}),
        }

        analysis = Analysis(order_id=order_id, result=analysis_result)
        db.session.add(analysis)
        db.session.commit()
        return analysis

    @staticmethod
    def get_analysis_by_order(order_id, user_id):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return None
        return Analysis.query.filter_by(order_id=order_id).first()
 copy
14. backend/app/api/payments.py
 copy
python

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.payment_service import PaymentService
from app.utils.exceptions import InvalidUsage

payments_bp = Blueprint("payments", __name__, url_prefix="/api/v1/payments")

@payments_bp.route("/orders/<int:order_id>/payment-intent", methods=["POST"])
@jwt_required()
def create_payment_intent(order_id):
    user_id = get_jwt_identity()
    intent = PaymentService.create_payment_intent(order_id, user_id)
    if not intent:
        raise InvalidUsage("Order not found or unauthorized", 404)
    return jsonify(intent), 200

@payments_bp.route("/orders/<int:order_id>/payment-confirm", methods=["POST"])
@jwt_required()
def confirm_payment(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    payment_id = data.get("payment_id")
    if not payment_id:
        raise InvalidUsage("payment_id is required", 400)
    success = PaymentService.confirm_payment(order_id, user_id, payment_id)
    if not success:
        raise InvalidUsage("Payment confirmation failed", 400)
    return jsonify({"message": "Payment confirmed"}), 200
 copy
15. backend/app/services/payment_service.py
 copy
python

import os
import stripe
from app import db
from app.models.order import Order
from app.config import Config

stripe.api_key = Config.STRIPE_SECRET_KEY

class PaymentService:

    @staticmethod
    def create_payment_intent(order_id, user_id):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return None
        # Use realistic pricing logic here
        amount = 5000  # cents, $50.00 USD
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",
                metadata={"order_id": order_id, "user_id": user_id},
            )
            return {"client_secret": intent.client_secret}
        except Exception:
            return None

    @staticmethod
    def confirm_payment(order_id, user_id, payment_id):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return False
        try:
            intent = stripe.PaymentIntent.retrieve(payment_id)
            if intent.status == "succeeded":
                order.status = "completed"
                db.session.commit()
                return True
            return False
        except Exception:
            return False
 copy
16. backend/app/utils/exceptions.py
 copy
python

from flask import jsonify

class InvalidUsage(Exception):
    def __init__(self, message, status_code=400):
        super().__init__()
        self.message = message
        self.status_code = status_code

    def to_dict(self):
        return {"error": self.message}

def register_error_handlers(app):
    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(err):
        response = jsonify(err.to_dict())
        response.status_code = err.status_code
        return response

    @app.errorhandler(400)
    def bad_request(err):
        return jsonify(error=str(err.description)), 400

    @app.errorhandler(401)
    def unauthorized(err):
        return jsonify(error=str(err.description)), 401

    @app.errorhandler(404)
    def not_found(err):
        return jsonify(error=str(err.description)), 404

    @app.errorhandler(500)
    def internal_error(err):
        return jsonify(error="Internal server error"), 500
 copy
17. backend/app/utils/validators.py
 copy
python

from flask import abort

def validate_register_data(data):
    if not data:
        abort(400, description="Missing JSON")
    if "email" not in data or not isinstance(data["email"], str):
        abort(400, description="Email is required")
    if "password" not in data or not isinstance(data["password"], str):
        abort(400, description="Password is required")

def validate_login_data(data):
    if not data:
        abort(400, description="Missing JSON")
    if "email" not in data or not isinstance(data["email"], str):
        abort(400, description="Email is required")
    if "password" not in data or not isinstance(data["password"], str):
        abort(400, description="Password is required")

def validate_order_data(data):
    # For now no required fields to create order, can be added as needed
    pass

def validate_order_status(data):
    if not data or "status" not in data or not isinstance(data["status"], str):
        abort(400, description="Status is required and must be string")
    if data["status"] not in {"pending", "processing", "completed", "cancelled"}:
        abort(400, description="Invalid status")

def validate_analysis_request(data):
    if not data:
        abort(400, description="Missing JSON")
    # Add further validation if needed
 copy
Frontend Complete Implementation
Note: Due to character limits, frontend code is provided compactly; full implementations are given in previous steps. Below is a summary with key files you need:

src/services/api.ts — Axios instance with JWT interceptor
src/services/auth.ts — Auth API calls
src/services/orders.ts — Orders API calls (including document upload)
src/services/analyses.ts — Analyses API calls
src/services/payments.ts — Stripe Payments API calls
src/store/ — Redux Toolkit setup with authSlice.ts, ordersSlice.ts
src/hooks/index.ts — typed hooks
src/pages/auth/LoginPage.tsx / RegisterPage.tsx
src/pages/orders/OrdersPage.tsx / OrderDetailsPage.tsx
src/App.tsx — React Router setup with protected routes
src/index.tsx — app root with store provider and MUI CssBaseline
All UI uses Material-UI v5 with responsive, accessible components.