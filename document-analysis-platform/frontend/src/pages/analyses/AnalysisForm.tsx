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
        await api.post(`/analyses/orders/${orderId}/analysis`, values);
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
