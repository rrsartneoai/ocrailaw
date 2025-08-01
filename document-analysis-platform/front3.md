1. Frontend Analysis & Payments Components (with Yup & Stripe E
lements)

1.1 Install dependencies
 copy
bash

cd frontend
npm install @stripe/react-stripe-js @stripe/stripe-js yup formik @mui/material @emotion/react @emotion/styled @testing-library/react @testing-library/jest-dom jest msw --save
1.2 AnalysisForm Component (src/pages/analyses/AnalysisForm.tsx)
 copy
tsx

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import { createAnalysis } from "../../services/analyses";

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
        await createAnalysis(orderId, { details: values });
        resetForm();
        setError("");
        onSuccess();
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to submit analysis");
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Submit Analysis Details</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          name="detailField"
          label="Detail Field"
          fullWidth
          margin="normal"
          value={formik.values.detailField}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.detailField && Boolean(formik.errors.detailField)}
          helperText={formik.touched.detailField && formik.errors.detailField}
          required
        />
        <Button type="submit" variant="contained" fullWidth disabled={formik.isSubmitting}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AnalysisForm;
 copy
1.3 PaymentForm Component (src/pages/payments/PaymentForm.tsx)
 copy
tsx

import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    createPaymentIntent(orderId)
      .then(({ data }) => setClientSecret(data.client_secret))
      .catch(() => setError("Failed to initialize payment"));
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not initialized");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card info not available");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    try {
      await confirmPayment(orderId, paymentIntent!.id);
      setSuccess(true);
    } catch {
      setError("Payment confirmation failed");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="success">Payment successful!</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Make Payment</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        <Button variant="contained" type="submit" fullWidth disabled={loading || !stripe} sx={{ mt: 3 }}>
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
2. React Testing Library + Jest Setup
2.1 Install dependencies
 copy
bash

npm install --save-dev @testing-library/react @testing-library/jest-dom jest msw
2.2 Example Test: src/pages/auth/__tests__/LoginPage.test.tsx
 copy
tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store";
import LoginPage from "../LoginPage";
import { BrowserRouter } from "react-router-dom";
import * as authApi from "../../../services/auth";

jest.mock("../../../services/auth");

test("LoginPage login flow", async () => {
  (authApi.login as jest.Mock).mockResolvedValue({ data: { access_token: "token" } });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => expect(authApi.login).toHaveBeenCalled());
  expect(authApi.login).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });
});
 copy
3. Docker Compose (docker-compose.yml)
 copy
yaml

version: "3.9"
services:
  backend:
    build: ./backend
    container_name: doc_backend
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/storage:/app/storage
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    container_name: doc_frontend
    env_file:
      - ./frontend/.env
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres:15
    container_name: doc_db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: document_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
 copy
4. GitHub Actions Workflow (.github/workflows/ci.yml)
 copy
yaml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend_test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: "3.10"
      - run: python -m venv venv
      - run: . venv/bin/activate && pip install -r requirements.txt
      - run: . venv/bin/activate && pytest
      - run: . venv/bin/activate && black --check . && isort --check-only . && flake8 .

  frontend_test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test -- --watchAll=false
      - run: npm run lint && npm run format:check
 copy
5. Backend Swagger API Docs Using Flask-RESTX (backend/app/api/__init__.py)
 copy
python

from flask_restx import Api
from flask import Blueprint

api_bp = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(api_bp,
          version="1.0",
          title="Document Analysis API",
          description="API documentation with Swagger UI")

# Import your namespaces and add them here, for example:

# from .auth_ns import ns as auth_ns
# api.add_namespace(auth_ns, path="/auth")

# Similarly for orders, documents, analyses, payments

# In your app factory, register blueprint:
# app.register_blueprint(api_bp)
You’ll create Namespace-based resources corresponding to each endpoint. You can follow Flask-RESTX docs for detailed examples.

6. Logging & Monitoring Setup (Backend)
Add the following to your backend/app/__init__.py inside create_app:

 copy
python

import logging
from logging.handlers import RotatingFileHandler
import os

def create_app():
    app = Flask(__name__)
    # ...

    if not app.debug and not app.testing:
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler("logs/doc_analysis.log", maxBytes=10240, backupCount=10)
        formatter = logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info("Document Analysis startup")

    return app
 copy
For monitoring, optionally integrate Prometheus or log aggregators per your platform.

7. AWS S3 File Storage Support (Optional)
Create backend/app/services/s3_service.py:

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
            region_name=os.getenv("AWS_REGION")
        )
        self.bucket = os.getenv("AWS_S3_BUCKET")

    def upload_fileobj(self, file_obj, key):
        self.s3.upload_fileobj(file_obj, self.bucket, key)
        return f"https://{self.bucket}.s3.amazonaws.com/{key}"

    def delete_file(self, key):
        self.s3.delete_object(Bucket=self.bucket, Key=key)
 copy
Update OrderService.add_document_to_order to use S3 upload if configured, falling back to local storage.

8. Environment Variables Management
Backend .env (gitignored):

 copy
env

DATABASE_URL=postgresql://user:password@db:5432/document_db
JWT_SECRET_KEY=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
UPLOAD_FOLDER=backend/storage/order_docs
Frontend .env (gitignored, Vite auto-inject):

 copy
env

VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_...
Use libraries like python-dotenv to load backend .env automatically.

Summary
You now have:

Frontend Analysis & Payment components with Yup validation and Stripe Elements.
Unit test example using React Testing Library + Jest.
Docker Compose for backend, frontend, and Postgres with persistent volumes.
CI workflow for testing and linting with GitHub Actions.
Swagger UI skeleton with Flask-RESTX.
Logging setup with rotating logs in Flask backend.
AWS S3 optional file storage with boto3.
Secure, version-controlled environment variables without secrets leaking.