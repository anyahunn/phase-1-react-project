import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";

interface AddCustomerProps {
  onCustomerAdded?: () => void;
  onCancel?: () => void;
}

function AddCustomer({ onCustomerAdded, onCancel }: AddCustomerProps = {}) {
  const [customer, setCustomer] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const cancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    // Reset form
    setCustomer({ name: "", email: "", password: "" });

    if (onCustomerAdded) {
      onCustomerAdded();
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography data-testid="add-customer-title" variant="h5" gutterBottom>
          Add Customer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} data-testid="add-customer-form">
          <Stack spacing={2}>
            <TextField
              data-testid="name-input"
              id="name"
              label="Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              data-testid="email-input"
              id="email"
              type="email"
              label="Email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              data-testid="password-input"
              id="password"
              type="password"
              label="Password"
              value={customer.password}
              onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={cancel} variant="outlined">
                Cancel
              </Button>
              <Button data-testid="add-customer-submit" type="submit" variant="contained">
                Add Customer
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddCustomer;
