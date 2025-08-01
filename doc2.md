Backend Implementation (Flask + SQLAlchemy + Flask-RESTX)
1.1 backend/app/__init__.py
 copy
python

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restx import Api
import logging
from logging.handlers import RotatingFileHandler

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
api = Api(version="1.0", title="Document Analysis API", doc="/docs", description="Document Analysis API")

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    from app.api.auth_ns import ns as auth_ns
    from app.api.orders_ns import ns as orders_ns
    from app.api.documents_ns import ns as documents_ns
    from app.api.analyses_ns import ns as analyses_ns
    from app.api.payments_ns import ns as payments_ns

    api.add_namespace(auth_ns, path="/api/v1/auth")
    api.add_namespace(orders_ns, path="/api/v1/orders")
    api.add_namespace(documents_ns, path="/api/v1/documents")
    api.add_namespace(analyses_ns, path="/api/v1/analyses")
    api.add_namespace(payments_ns, path="/api/v1/payments")

    if not app.debug and not app.testing:
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=10)
        file_handler.setFormatter(
            logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]")
        )
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info("App startup")

    from app.utils.exceptions import register_error_handlers
    register_error_handlers(app)

    return app
 copy
1.2 backend/app/config.py
 copy
python

import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://user:pass@db:5432/document_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "storage/order_docs")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION")
    AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
1.3 Database Models (e.g., backend/app/models/user.py, order.py, document.py, analysis.py)
(Define as per previous details with SQLAlchemy ORM, including relationships and .to_dict() methods)

1.4 API Namespaces (Example: backend/app/api/auth_ns.py)
 copy
python

from flask_restx import Namespace, Resource, fields
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

ns = Namespace("auth", description="Authentication")

user_model = ns.model(
    "User", {
        "id": fields.Integer(readOnly=True),
        "email": fields.String(required=True),
        "full_name": fields.String,
    }
)

register_model = ns.model(
    "Register", {
        "email": fields.String(required=True),
        "password": fields.String(required=True),
        "full_name": fields.String,
    }
)

login_model = ns.model(
    "Login", {
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    }
)

@ns.route("/register")
class Register(Resource):
    @ns.expect(register_model)
    def post(self):
        data = request.json
        if User.query.filter_by(email=data["email"]).first():
            ns.abort(400, "Email already registered")
        user = User(
            email=data["email"],
            password_hash=generate_password_hash(data["password"]),
            full_name=data.get("full_name"),
        )
        db.session.add(user)
        db.session.commit()
        return {"message": "User registered"}, 201

@ns.route("/login")
class Login(Resource):
    @ns.expect(login_model)
    def post(self):
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not check_password_hash(user.password_hash, data["password"]):
            ns.abort(401, "Invalid credentials")
        token = create_access_token(identity=user.id)
        return {"access_token": token}
 copy
(Similarly implement other namespaces for orders, documents, analyses, payments using Flask-RESTX)

1.5 AWS S3 Storage Helper (app/services/s3_service.py)
 copy
python

import boto3
import os
from botocore.exceptions import BotoCoreError, ClientError

class S3Service:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
        )
        self.bucket = os.getenv("AWS_S3_BUCKET")

    def upload_file(self, file_obj, key):
        try:
            self.client.upload_fileobj(file_obj, self.bucket, key)
            return f"https://{self.bucket}.s3.amazonaws.com/{key}"
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError("S3 Upload failed") from e

    def delete_file(self, key):
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
        except Exception:
            pass
 copy
2. Frontend Implementation (React + TypeScript + Material UI)
2.1 API Service (src/services/api.ts)
 copy
typescript

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
2.2 Auth Service (src/services/auth.ts), Orders, Documents, Analyses, Payments services similarly.
Refer to earlier code blocks for detailed implementation.

2.3 React Components: AnalysisForm, PaymentForm, LoginPage, RegisterPage, OrdersPage, OrderDetailsPage.
Refer to earlier detailed sections for full code.

2.4 Redux Toolkit Store Setup
src/store/index.ts with authSlice.ts and ordersSlice.ts as detailed earlier.

2.5 React Testing Library
Refer to earlier test example for LoginPage and extend similarly.

3. Docker and Docker Compose Setup
3.1 Dockerfile Backend (backend/Dockerfile)
 copy
dockerfile

FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0"]
3.2 Dockerfile Frontend (frontend/Dockerfile)
 copy
dockerfile

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
3.3 docker-compose.yml
As detailed earlier with backend, frontend, db services.

4. GitHub Actions CI Workflow
As detailed earlier with backend and frontend test jobs.

5. Environment Variables
Use .env files (gitignored) for backend and frontend with appropriate variables including AWS and Stripe keys.

6. Running the Project
Build and run services with docker-compose up --build
Run backend migrations: docker exec -it doc_backend flask db upgrade
Access Swagger UI for API docs at http://localhost:5000/docs
Run frontend at http://localhost:3000
Run tests with npm test (frontend), pytest (backend) or via CI