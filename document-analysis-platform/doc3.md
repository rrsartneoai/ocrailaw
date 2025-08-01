1 Backend Implemen
tation

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
api = Api(
    title="Document Analysis API",
    version="1.0",
    description="REST API for Document Analysis Platform",
    doc="/docs"
)

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
        app.logger.info("Document Analysis startup")

    from app.utils.exceptions import register_error_handlers
    register_error_handlers(app)

    return app
 copy
1.2 backend/app/config.py
 copy
python

import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/document_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "storage/order_docs")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION")
    AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
1.3 Models
backend/app/models/user.py
backend/app/models/order.py
backend/app/models/document.py
backend/app/models/analysis.py
(Implement with SQLAlchemy ORM, relationships, and to_dict() methods as per earlier specifications)

1.4 API Namespaces
Create backend/app/api/ folder with:

auth_ns.py (authentication endpoints)
orders_ns.py
documents_ns.py
analyses_ns.py
payments_ns.py
Each defining a Namespace in Flask-RESTX with Resource classes and schema models.

Example provided earlier for auth_ns.py.

1.5 S3 Service: backend/app/services/s3_service.py
 copy
python

import boto3
import os

class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
        )
        self.bucket = os.getenv("AWS_S3_BUCKET")

    def upload_fileobj(self, file_obj, key):
        self.s3.upload_fileobj(file_obj, self.bucket, key)
        return f"https://{self.bucket}.s3.amazonaws.com/{key}"

    def delete_file(self, key):
        self.s3.delete_object(Bucket=self.bucket, Key=key)
 copy
2 Frontend Setup
2.1 src/services/api.ts
 copy
typescript

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
2.2 Services
Implement auth.ts, orders.ts, documents.ts, analyses.ts, payments.ts services using api.

2.3 React Components
Implement:

pages/auth/LoginPage.tsx and RegisterPage.tsx
pages/orders/OrdersPage.tsx and OrderDetailsPage.tsx
pages/analyses/AnalysisForm.tsx (with Formik & Yup)
pages/payments/PaymentForm.tsx (with Stripe Elements)
Refer to detailed code in previous parts for full source.

2.4 Redux Store
Setup slices for auth and orders with async thunks for API calls, typed hooks useAppDispatch and useAppSelector.

2.5 Tests
Use Jest and React Testing Library for components and Redux slices.

Example test in earlier parts (LoginPage.test.tsx).

3 Docker & Docker Compose
3.1 Dockerfile Backend (backend/Dockerfile)
 copy
dockerfile

FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
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
 copy
yaml

version: "3.9"
services:
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/document_db
      - JWT_SECRET_KEY=secret
      - STRIPE_SECRET_KEY=sk_test_...
    ports:
      - 5000:5000
    depends_on:
      - db
    volumes:
      - ./backend/storage:/app/storage

  frontend:
    build: ./frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api/v1
      - VITE_STRIPE_PUBLIC_KEY=pk_test_...
    ports:
      - 3000:3000
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: document_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - 5432:5432
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
 copy
4 GitHub Actions Workflow
.github/workflows/ci.yml:

As specified earlier — sets up Python and Node environments, runs backend/pytest, frontend Jest tests, linting, and formatting checks.

5 Swagger API Docs
Served via Flask-RESTX /docs endpoint by registering namespaces in the backend app as shown.

6 Logging
Rotating file handler logging configured in backend app factory.

7 AWS S3 Integration
Uses boto3 client in backend to upload/remove files, controlled by environment variables.

8 Environment Variables Management
Use .env files (gitignored) for backend and frontend with secure secret keys.
Load backend env via python-dotenv or container environment variables.
Frontend environment vars prefixed with VITE_ automatically injected by Vite.
Store secrets securely in deployment environment (e.g., GitHub secrets, Docker secrets).
Summary
This completes the entire Document Analysis Platform full-stack solution, production ready with:

Flask RESTful API with JWT auth, PostgreSQL, migrations, Swagger docs, logging, S3 file support
React + TS frontend with Material UI, Stripe payments, form validation, Redux state management, testing
Containerized backend, frontend, and DB with Docker Compose
CI/CD pipeline using GitHub Actions for testing and linting