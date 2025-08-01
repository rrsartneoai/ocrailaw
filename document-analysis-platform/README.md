Below you will find a full repo archive layout, then stepwise file-by-file code generation for both backend and frontend including Docker and CI/CD, and finally deployment instructions. You can copy each file to build the proje

ct, and at the end you will also get instructions to run and deploy it.

FULL REPO ARCHIVE LAYOUT
 copy
javascript

document-analysis-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── order.py
│   │   │   ├── document.py
│   │   │   └── analysis.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth_ns.py
│   │   │   ├── orders_ns.py
│   │   │   ├── documents_ns.py
│   │   │   ├── analyses_ns.py
│   │   │   └── payments_ns.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── s3_service.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── exceptions.py
│   │   └── app.py
│   ├── migrations/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── analyses/
│   │   │   │   └── AnalysisForm.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   └── OrderDetailsPage.tsx
│   │   │   └── payments/
│   │   │       └── PaymentForm.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── orders.ts
│   │   │   ├── analyses.ts
│   │   │   └── payments.ts
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   └── ordersSlice.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env
│   └── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml
 copy
STEPWISE FILE-BY-FILE CODE GENERATION
Backend
1. backend/app/__init__.py
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
2. backend/app/config.py
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
3. Models example backend/app/models/user.py
 copy
python

from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))

    orders = db.relationship("Order", back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
        }
 copy
(Implement similarly order.py, document.py, analysis.py with relationships and needed properties)

4. API Namespace sample: backend/app/api/auth_ns.py
 copy
python

from flask_restx import Namespace, Resource, fields
from flask import request
from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
 copy
(Similarly create other namespaces orders_ns.py, documents_ns.py, analyses_ns.py, payments_ns.py with routes per your API spec.)

5. AWS S3 Service: backend/app/services/s3_service.py
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
6. Backend entrypoint backend/app/app.py
 copy
python

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
7. backend/requirements.txt
 copy
javascript

Flask>=2.3
Flask-SQLAlchemy>=3.0
Flask-JWT-Extended>=4.4
Flask-Migrate>=4.0
Flask-RESTX>=1.1
psycopg2-binary>=2.9
boto3>=1.24
Werkzeug>=2.3
pytest>=7.0
pytest-flask>=1.2
stripe>=5.0
python-dotenv>=0.21
8. Backend Dockerfile: backend/Dockerfile
 copy
dockerfile

FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]
Frontend
1. Frontend API Service frontend/src/services/api.ts
 copy
typescript

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
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
2. Example Frontend Auth Service frontend/src/services/auth.ts
 copy
typescript

import api from "./api";

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegisterData) => api.post("/auth/register", data);
export const login = (data: LoginData) => api.post("/auth/login", data);
export const logout = () => localStorage.removeItem("jwt_token");
export const getCurrentUser = () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;
  // decode or request /auth/me for user details (add accordingly)
  return { token };
};
 copy
3. frontend/src/pages/analyses/AnalysisForm.tsx
 copy
tsx

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { createAnalysis } from "../../services/analyses";

interface Props {
  orderId: number;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  detailField: Yup.string().required("Detail is required"),
});

const AnalysisForm: React.FC<Props> = ({ orderId, onSuccess }) => {
  const [error, setError] = React.useState("");

  const formik = useFormik({
    initialValues: { detailField: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createAnalysis(orderId, { details: values });
        resetForm();
        setError("");
        onSuccess();
      } catch (e: any) {
        setError(e.response?.data?.error || "Submit failed");
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Submit Analysis Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Detail"
          name="detailField"
          value={formik.values.detailField}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.detailField && Boolean(formik.errors.detailField)}
          helperText={formik.touched.detailField && formik.errors.detailField}
          required
        />
        <Button type="submit" variant="contained" fullWidth disabled={formik.isSubmitting} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AnalysisForm;
 copy
4. frontend/src/pages/payments/PaymentForm.tsx
 copy
tsx

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Container, Typography, Box, Button, CircularProgress, Alert } from "@mui/material";
import { createPaymentIntent, confirmPayment } from "../../services/payments";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Props {
  orderId: number;
}

const CheckoutForm: React.FC<Props> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    createPaymentIntent(orderId)
      .then(({ data }) => setClientSecret(data.client_secret))
      .catch(() => setError("Failed to get payment intent"));
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Enter card info");
      setLoading(false);
      return;
    }

    const res = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
    if (res.error) {
      setError(res.error.message || "Payment error");
      setLoading(false);
      return;
    }
    try {
      await confirmPayment(orderId, res.paymentIntent!.id);
      setSuccess(true);
    } catch {
      setError("Confirm payment failed");
    }
    setLoading(false);
  };

  if (success)
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="success">Payment successful!</Alert>
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Pay
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        <Button variant="contained" type="submit" fullWidth disabled={loading || !stripe} sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Pay Now"}
        </Button>
      </Box>
    </Container>
  );
};

const PaymentFormWrapper: React.FC<Props> = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default PaymentFormWrapper;
 copy
5. Redux Slice Example frontend/src/store/authSlice.ts
 copy
typescript

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../services/auth";

interface AuthState {
  user: any;
  token: string | null;
  status: "idle" | "loading" | "failed";
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("jwt_token"),
  status: "idle",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("jwt_token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.access_token;
      localStorage.setItem("jwt_token", state.token);
      state.status = "idle";
    });
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
 copy
6. Frontend Package and Config files:
frontend/package.json (with react, mui, redux, stripe, axios, typescript, jest, etc.)
frontend/tsconfig.json
frontend/vite.config.ts
.env:
 copy
javascript

VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
7. Frontend Dockerfile: frontend/Dockerfile
 copy
dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
Root-level files
1. docker-compose.yml
 copy
yaml

version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - '5000:5000'
    volumes:
      - ./backend/storage:/app/storage
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    env_file:
      - ./frontend/.env
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: document_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
2. GitHub Actions CI Workflow: .github/workflows/ci.yml
 copy
yaml

name: CI & Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.10
      - run: python -m venv venv
      - run: . venv/bin/activate && pip install -r requirements.txt
      - run: . venv/bin/activate && flask db upgrade
      - run: . venv/bin/activate && pytest
      - run: . venv/bin/activate && black --check . && isort --check-only . && flake8 .

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test -- --watchAll=false
      - run: npm run lint
 copy
DEPLOYMENT INSTRUCTIONS
Prerequisites
Docker and Docker Compose installed
Environment variables properly set in .env files in backend and frontend
(Optional) AWS Credentials in backend .env for S3
Run Locally with Docker Compose
 copy
bash

git clone <repo-url>
cd document-analysis-platform

# Build and start containers
docker-compose up --build
Containers:

Backend REST API at http://localhost:5000
Frontend React at http://localhost:3000
Swagger API documentation at http://localhost:5000/docs
Initialize database migrations (run inside backend container):
 copy
bash

docker exec -it <backend-container-id or name> flask db upgrade
Running tests
Backend:
 copy
bash

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest
Frontend:
 copy
bash

cd frontend
npm ci
npm test
Final Notes
The full project is modular and extensible
Replace <repo-url> or optionally ask me for a zipped archive with all files
Customize .env files accordingly for Stripe and AWS keys
Use CI/CD pipeline via GitHub Actions included to keep quality


====================================


How to generate full project:
Create a new directory and cd into it.

Create a file named generate_project.sh and paste the script below into it:

 copy
bash

#!/bin/bash

set -e

# Create backend folders and files
mkdir -p backend/app/api backend/app/models backend/app/services backend/app/utils backend/migrations backend/storage
mkdir -p frontend/src/pages/analyses frontend/src/pages/auth frontend/src/pages/orders frontend/src/pages/payments frontend/src/services frontend/src/store

# backend/app/__init__.py
cat > backend/app/__init__.py <<EOF
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
EOF

# backend/app/config.py
cat > backend/app/config.py <<EOF
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
EOF

# backend/app/models/user.py
cat > backend/app/models/user.py <<EOF
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
        }
EOF

# backend/app/models/__init__.py
touch backend/app/models/__init__.py

# backend/app/api/auth_ns.py - (example auth namespace)
cat > backend/app/api/auth_ns.py <<EOF
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
EOF

# backend/app/api/__init__.py
touch backend/app/api/__init__.py

# backend/app/services/s3_service.py
cat > backend/app/services/s3_service.py <<EOF
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
EOF

# backend/app/utils/__init__.py
touch backend/app/utils/__init__.py

# backend/app/utils/exceptions.py
cat > backend/app/utils/exceptions.py <<EOF
def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return {"error": "Not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500
EOF

# backend/app/app.py
cat > backend/app/app.py <<EOF
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
EOF

# backend/requirements.txt
cat > backend/requirements.txt <<EOF
Flask>=2.3
Flask-SQLAlchemy>=3.0
Flask-JWT-Extended>=4.4
Flask-Migrate>=4.0
Flask-RESTX>=1.1
psycopg2-binary>=2.9
boto3>=1.24
Werkzeug>=2.3
pytest>=7.0
pytest-flask>=1.2
stripe>=5.0
python-dotenv>=0.21
EOF

# backend/Dockerfile
cat > backend/Dockerfile <<EOF
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]
EOF

# backend/.env
cat > backend/.env <<EOF
DATABASE_URL=postgresql://user:password@db:5432/document_db
JWT_SECRET_KEY=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_xxx
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name
UPLOAD_FOLDER=storage/order_docs
EOF

# frontend/package.json
cat > frontend/package.json <<EOF
{
  "name": "document-analysis-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@emotion/react": "^11.10.4",
    "@emotion/styled": "^11.10.4",
    "@mui/material": "^5.11.0",
    "@reduxjs/toolkit": "^1.9.1",
    "@stripe/react-stripe-js": "^1.15.0",
    "@stripe/stripe-js": "^1.36.0",
    "axios": "^1.2.1",
    "formik": "^2.2.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.3",
    "typescript": "^4.9.4",
    "yup": "^0.32.11"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@vitejs/plugin-react": "^3.0.1",
    "eslint": "^8.27.0",
    "jest": "^29.3.1",
    "prettier": "^2.8.1",
    "vite": "^4.0.0"
  }
}
EOF

# frontend/.env
cat > frontend/.env <<EOF
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
EOF

# frontend/vite.config.ts
cat > frontend/vite.config.ts <<EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});
EOF

# frontend/tsconfig.json
cat > frontend/tsconfig.json <<EOF
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOF

# frontend/src/services/api.ts
mkdir -p frontend/src/services
cat > frontend/src/services/api.ts <<EOF
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt_token");
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
EOF

# frontend/src/services/auth.ts
cat > frontend/src/services/auth.ts <<EOF
import api from "./api";

export const register = (data: {email:string, password:string, full_name?:string}) => api.post("/auth/register", data);
export const login = (data: {email:string, password:string}) => api.post("/auth/login", data);
export const logout = () => localStorage.removeItem("jwt_token");
EOF

# frontend/src/pages/analyses/AnalysisForm.tsx
mkdir -p frontend/src/pages/analyses
cat > frontend/src/pages/analyses/AnalysisForm.tsx <<EOF
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import api from "../../services/api";

interface Props {
  orderId: number;
  onSuccess: () => void;
}

const schema = Yup.object({
  detailField: Yup.string().required("Detail is required"),
});

const AnalysisForm: React.FC<Props> = ({ orderId, onSuccess }) => {
  const [error, setError] = React.useState<string>("");

  const formik = useFormik({
    initialValues: { detailField: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post(\`/analyses/orders/\${orderId}/analysis\`, values);
        resetForm();
        setError("");
        onSuccess();
      } catch (e: any) {
        setError(e.response?.data?.error || "Submit failed");
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Submit Analysis Details
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Detail"
          name="detailField"
          value={formik.values.detailField}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.detailField && Boolean(formik.errors.detailField)}
          helperText={formik.touched.detailField && formik.errors.detailField}
          required
        />
        <Button type="submit" variant="contained" fullWidth disabled={formik.isSubmitting} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AnalysisForm;
EOF

# frontend/src/pages/payments/PaymentForm.tsx
mkdir -p frontend/src/pages/payments
cat > frontend/src/pages/payments/PaymentForm.tsx <<EOF
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Container, Typography, Box, Button, CircularProgress, Alert } from "@mui/material";
import api from "../../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Props {
  orderId: number;
}

const CheckoutForm: React.FC<Props> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.post(\`/payments/orders/\${orderId}/payment-intent\`).then(res => {
      setClientSecret(res.data.client_secret);
    }).catch(() => setError("Failed to get payment intent"));
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Enter card info");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {payment_method: {card}});
    if (result.error) {
      setError(result.error.message ?? "Payment error");
      setLoading(false);
      return;
    }

    try {
      await api.post(\`/payments/orders/\${orderId}/payment-confirm\`, { payment_intent_id: result.paymentIntent?.id });
      setSuccess(true);
    } catch {
      setError("Payment confirmation failed");
    }

    setLoading(false);
  };

  if (success) return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Alert severity="success">Payment successful!</Alert>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Make Payment</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        <Button type="submit" disabled={loading || !stripe} fullWidth variant="contained" sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Pay Now"}
        </Button>
      </Box>
    </Container>
  );
};

export default function PaymentFormWrapper(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
EOF

# frontend/Dockerfile
cat > frontend/Dockerfile <<EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
EOF

# docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - '5000:5000'
    volumes:
      - ./backend/storage:/app/storage
    env_file:
      - ./backend/.env
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    env_file:
      - ./frontend/.env
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: document_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# .github/workflows/ci.yml
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<EOF
name: CI & Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.10
      - run: python -m venv venv
      - run: . venv/bin/activate && pip install -r requirements.txt
      - run: . venv/bin/activate && flask db upgrade
      - run: . venv/bin/activate && pytest
      - run: . venv/bin/activate && black --check . && isort --check-only . && flake8 .

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test -- --watchAll=false
      - run: npm run lint
EOF

echo "Project files created! Run 'docker-compose up --build' to build and start the project."
echo "Make sure to customize the .env files with your secrets and Stripe / AWS keys."
 copy
Give this script execute permissions and run it:
 copy
bash

chmod +x generate_project.sh
./generate_project.sh
This will create all necessary folders and files as per your project structure with ready-to-use content.

Next Steps
Edit .env files with your actual PostgreSQL, Stripe, AWS credentials.
Use docker-compose to build and run:
 copy
bash

docker-compose up --build
On first run, enter backend container and run migrations:
 copy
bash

docker-compose exec backend flask db upgrade
Frontend will be at http://localhost:3000, backend API at http://localhost:5000, API docs at http://localhost:5000/docs



==========================

Below are step-by-step instructions for:

Pushing your project to GitHub,
Running backend and frontend tests,
Deploying on a cloud platform (example: Heroku for backend + Netlify for frontend).
1. How to Pu
sh the Project to GitHub

Step 1: Initialize a Git repository
Make sure you are in the root folder of your project (document-analysis-platform/):

 copy
bash

git init
Step 2: Create a .gitignore file
Create .gitignore file at project root with at least:

 copy
javascript

# Python
backend/venv/
backend/__pycache__/
backend/*.pyc
backend/storage/
backend/.env
backend/migrations/

# Node
frontend/node_modules/
frontend/dist/
frontend/.env

# Logs
logs/
*.log

# Docker
*.env

# IDE files
.vscode/
.idea/
Step 3: Add files, commit
 copy
bash

git add .
git commit -m "Initial commit - add full Document Analysis Platform project"
Step 4: Create a new repository on GitHub
Go to https://github.com/new
Enter repository name (e.g. document-analysis-platform)
Choose public or private
Do not initialize with README or Gitignore (already have them)
Click "Create repository"
Step 5: Add remote and push
Follow instructions from GitHub after creating repo:

 copy
bash

git remote add origin https://github.com/yourusername/document-analysis-platform.git
git branch -M main
git push -u origin main
(Replace yourusername accordingly)

2. Running Tests
Backend tests
Make sure Python env is activated, deps installed:

 copy
bash

cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
# For Windows PowerShell: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Run tests with pytest:

 copy
bash

pytest
All backend tests should run and report output.

Frontend tests
 copy
bash

cd ../frontend
npm install
npm run test
You can also run tests in watch mode:

 copy
bash

npm run test -- --watch
3. Deploying on a Cloud Platform
Backend: Deploy on Heroku (PostgreSQL included, free tier)
Step 1: Install Heroku CLI (if not installed)
https://devcenter.heroku.com/articles/heroku-cli

Step 2: Login
 copy
bash

heroku login
Step 3: Create Heroku app
 copy
bash

heroku create your-app-name
Step 4: Provision PostgreSQL add-on (free tier)
 copy
bash

heroku addons:create heroku-postgresql:hobby-dev
Step 5: Add environment variables on Heroku
You must set your secrets (use replaced values):

 copy
bash

heroku config:set JWT_SECRET_KEY='your_jwt_secret'
heroku config:set STRIPE_SECRET_KEY='your_stripe_secret_key'
heroku config:set AWS_ACCESS_KEY_ID='your_aws_access_key_id'
heroku config:set AWS_SECRET_ACCESS_KEY='your_aws_secret_access_key'
heroku config:set AWS_REGION='your_aws_region'
heroku config:set AWS_S3_BUCKET='your_s3_bucket_name'
heroku config:set UPLOAD_FOLDER='storage/order_docs'
Step 6: Push your code to Heroku git
 copy
bash

git push heroku main
Step 7: Run migrations on Heroku
 copy
bash

heroku run flask db upgrade
Step 8: Open your app
 copy
bash

heroku open
Your backend should be running on https://your-app-name.herokuapp.com.

Frontend: Deploy on Netlify
Step 1: Build your frontend for production
 copy
bash

cd frontend
npm run build
By default, Vite outputs to dist folder.

Step 2: Create a new site on Netlify
Go to https://app.netlify.com.
Click "Add new site" > "Deploy manually".
Drag and drop frontend/dist folder to upload.
Or connect your GitHub repo and set build command:

Build Command: npm run build
Publish directory: dist
Set environment variables on Netlify (e.g. VITE_API_BASE_URL and VITE_STRIPE_PUBLIC_KEY).

Step 3: Deploy and visit your frontend site
Netlify will provide a custom domain.

Make sure backend URL in frontend ENV points to your Heroku backend URL.

Summary
Push: Initialize git, add remote, push to GitHub.
Tests: Run pytest for backend, Jest for frontend.
Deploy: Use Heroku for backend and Netlify for frontend with environment variables properly configured.


===============================