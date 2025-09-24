import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateCustomer.css';
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material';

interface UpdateCustomerProps {
    customerId?: number;
    onCustomerUpdated?: () => void;
    onCancel?: () => void;
}

function UpdateCustomer({ customerId: propId, onCustomerUpdated, onCancel }: UpdateCustomerProps = {}) {
    const { id: paramId } = useParams();
    const id = propId || Number(paramId);
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ id: Number(id), name: '', email: '', password: '' });

    useEffect(() => {
        // Fetch customer from REST server
        fetch(`http://localhost:4000/customers/${id}`)
            .then(res => res.json())
            .then(data => {
                setCustomer({ id: data.id, name: data.name, email: data.email, password: data.password });
            })
            .catch(err => console.error('Failed to fetch customer:', err));
    }, [id]);

    const cancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Update customer on REST server
        await fetch(`http://localhost:4000/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
        
        if (onCustomerUpdated) {
            onCustomerUpdated();
        } else {
            navigate('/');
        }
    };

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto', mt: 6 }}>
            <Paper sx={{ p: 3 }}>
                <Typography data-testid="update-customer-title" variant="h5" gutterBottom>
                    Update Customer
                </Typography>
                <Box component="form" onSubmit={handleSubmit} data-testid="update-customer-form">
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
                            <Button onClick={cancel} variant="outlined">Cancel</Button>
                            <Button data-testid="submit-button" type="submit" variant="contained">Update Customer</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default UpdateCustomer;