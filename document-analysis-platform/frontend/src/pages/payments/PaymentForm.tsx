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
    api.post(`/payments/orders/${orderId}/payment-intent`).then(res => {
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
      await api.post(`/payments/orders/${orderId}/payment-confirm`, { payment_intent_id: result.paymentIntent?.id });
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
