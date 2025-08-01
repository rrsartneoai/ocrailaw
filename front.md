
1. Frontend: Analysis & Payments React Components with Stripe Elements and Yup Validation
1.1 Install dependencies
 copy
bash

cd frontend
npm install @stripe/react-stripe-js @stripe/stripe-js yup formik
1.2 Analysis Form Component: src/pages/analyses/AnalysisForm.tsx
 copy
tsx

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { createAnalysis } from "../../services/analyses";

interface AnalysisFormProps {
  orderId: number;
  onAnalysisCreated: () => void;
}

const validationSchema = Yup.object({
  detailField: Yup.string().required("Detail is required"),
});

const AnalysisForm: React.FC<AnalysisFormProps> = ({ orderId, onAnalysisCreated }) => {
  const [error, setError] = React.useState<string>("");

  const formik = useFormik({
    initialValues: { detailField: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createAnalysis(orderId, { details: values });
        resetForm();
        setError("");
        onAnalysisCreated();
      } catch (err: any) {
        setError(err.response?.data?.error || "Analysis failed");
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Submit Analysis Details
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Detail Field"
          name="detailField"
          value={formik.values.detailField}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.detailField && Boolean(formik.errors.detailField)}
          helperText={formik.touched.detailField && formik.errors.detailField}
          required
        />
        <Button type="submit" variant="contained" fullWidth disabled={formik.isSubmitting}>
          Submit Analysis
        </Button>
      </Box>
    </Container>
  );
};

export default AnalysisForm;
 copy
1.3 Payments Component with Stripe Elements: src/pages/payments/PaymentForm.tsx
 copy
tsx

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Container,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { createPaymentIntent, confirmPayment } from "../../services/payments";

interface PaymentFormProps {
  orderId: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm: React.FC<PaymentFormProps> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    createPaymentIntent(orderId)
      .then((res) => setClientSecret(res.data.client_secret))
      .catch(() => setError("Failed to initialize payment"));
  }, [orderId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe has not loaded yet");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card information not entered");
      setLoading(false);
      return;
    }

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message || "Payment failed");
      setLoading(false);
      return;
    }

    // Confirm payment on backend
    try {
      await confirmPayment(orderId, paymentResult.paymentIntent!.id);
      setSuccess(true);
    } catch {
      setError("Payment confirmation failed");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Complete Payment</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Payment succeeded!</Alert>}

      {!success && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <CardElement options={{
            style: { base: { fontSize: "16px", color: "#424770" } }
          }} />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!stripe || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Pay Now"}
          </Button>
        </Box>
      )}
    </Container>
  );
};

const PaymentFormWrapper: React.FC<PaymentFormProps> = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default PaymentFormWrapper;
 copy
2. React Testing Library and Jest Setup
2.1 Install testing dependencies
 copy
bash

cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest msw
2.2 Example test: src/pages/auth/__tests__/LoginPage.test.tsx
 copy
tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store";
import LoginPage from "../LoginPage";
import { BrowserRouter } from "react-router-dom";
import * as authService from "../../../services/auth";

jest.mock("../../../services/auth");

describe("LoginPage", () => {
  test("renders and submits login form", async () => {
    (authService.login as jest.Mock).mockResolvedValue({ data: { access_token: "token" } });

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

    await waitFor(() => expect(authService.login).toHaveBeenCalled());

    expect(authService.login).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });
  });
});
 copy
3. Docker Compose Setup: docker-compose.yml
 copy
yaml

version: "3.9"
services:
  backend:
    build:
      context: ./backend
    container_name: doc_analysis_backend
    restart: always
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/storage:/app/storage
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
    container_name: doc_analysis_frontend
    restart: always
    env_file:
      - ./frontend/.env
    ports:
      - "3000:3000"
    depends_on:
      - backend

  db:
    image: postgres:15
    container_name: doc_analysis_db
    restart: always
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
4. GitHub Actions Workflow: .github/workflows/ci.yml
 copy
yaml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.10"
      - name: Install dependencies
        run: |
          python -m venv venv
          source venv/bin/activate
          pip install -r requirements.txt
      - name: Run backend tests
        run: |
          source venv/bin/activate
          pytest
      - name: Lint backend
        run: black --check . && isort --check-only . && flake8 .

  frontend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run frontend tests
        run: npm test -- --watchAll=false
      - name: Lint frontend
        run: npm run lint && npm run format:check
 copy
5. Backend Swagger API Docs with Flask-RESTX: backend/app/api/__init__.py
Modify your app.py or main entry to use Flask-RESTX

 copy
python

from flask import Flask
from flask_restx import Api
from app import create_app, db

app = create_app()
api = Api(app, version="1.0", title="Document Analysis API", description="API docs")

# Import resources and namespaces for auth, orders etc. here, add them to api
# Example:
# from app.api.auth_ns import ns as auth_ns
# api.add_namespace(auth_ns, path="/api/v1/auth")

if __name__ == "__main__":
    app.run()
You'd create namespaces (auth_ns, orders_ns, etc.) with Flask-RESTX Resources and models to expose Swagger UI at /.

6. Logging & Monitoring Setup (Backend)
In backend/app/__init__.py, add logging:

 copy
python

import logging
from logging.handlers import RotatingFileHandler
import os

def create_app():
    app = Flask(__name__)
    # ... existing setup

    if not app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/document_analysis.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Document Analysis startup')

    return app
 copy
Add monitoring integration (like Prometheus exporter) as per your deployment requirements.

7. AWS S3 File Storage Support (Optional)
Create backend/app/services/s3_service.py:

 copy
python

import boto3
from botocore.exceptions import BotoCoreError, ClientError
import os

class S3Service:
    s3 = boto3.client('s3',
                      aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                      aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                      region_name=os.getenv('AWS_REGION'))

    bucket = os.getenv('AWS_S3_BUCKET')

    @classmethod
    def upload_file(cls, file_obj, key) -> str:
        """
        Uploads file_obj to s3 with key and returns s3 URL.
        """
        try:
            cls.s3.upload_fileobj(file_obj, cls.bucket, key)
            s3_url = f"https://{cls.bucket}.s3.amazonaws.com/{key}"
            return s3_url
        except (BotoCoreError, ClientError) as e:
            raise Exception("S3 upload failed") from e

    @classmethod
    def delete_file(cls, key) -> None:
        try:
            cls.s3.delete_object(Bucket=cls.bucket, Key=key)
        except Exception:
            pass  # Log error in real app, ignore for now
 copy
Then in the OrderService.add_document_to_order, conditionally upload to S3 instead of local FS.

8. Manage Environment Variables Securely
Use .env files with Python python-dotenv in backend:

In backend/.env

 copy
javascript

DATABASE_URL=postgresql://user:password@db:5432/document_db
JWT_SECRET_KEY=verysecretkey
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
Load in app/__init__.py or config.py using from dotenv import load_dotenv

For frontend, create .env with secure prefix (VITE_ for Vite):

In frontend/.env

 copy
javascript

VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_...
Make sure .env files are gitignored and set environment vars in the deployment environment securely.