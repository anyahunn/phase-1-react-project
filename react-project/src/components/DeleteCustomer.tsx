import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

function DeleteCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  }, [id]);

  const handleDelete = async () => {
    await fetch(`http://localhost:4000/customers/${id}`, { method: "DELETE" });
    navigate("/");
  };

  if (!customer) {
    return (
      <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer not found
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 6, elevation: 3, boxShadow: 3, rounded: 4 }}>
      <Typography variant="h2" gutterBottom>
        Delete Customer
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h5" gutterBottom>
            <strong>Name:</strong> {customer.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            <strong>Email:</strong> {customer.email}
          </Typography>
          <Typography variant="h5" gutterBottom>
            <strong>Password:</strong> {customer.password}
          </Typography>
        </Stack>
      </Box>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="error" onClick={handleDelete}>
          Confirm Delete
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
}

export default DeleteCustomer;
