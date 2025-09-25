import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateCustomer.css';

interface UpdateCustomerProps {
    customerId?: number;
    onCustomerUpdated?: () => void;
    onCancel?: () => void;
}

function UpdateCustomer({ customerId: propId, onCustomerUpdated, onCancel }: UpdateCustomerProps = {}) {
    const { id: paramId } = useParams();
    const id = propId !== undefined ? Number(propId) : Number(paramId);
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
        <div className='container'>
            <h2 data-testid="update-customer-title" className="update-customer-title">Update Customer</h2>
            <form onSubmit={handleSubmit} data-testid="update-customer-form" className="update-customer-form">
                <div className="form-group">
                    <label className="label" htmlFor="name">Name:</label>
                    <input
                        data-testid="name-input"
                        className="input"
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="email">Email:</label>
                    <input
                        data-testid="email-input"
                        className="input"
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Password:</label>
                    <input
                        data-testid="password-input"
                        className="input"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        required
                    />
                </div>
                <button data-testid="submit-button" className="submit-button" type="submit">Update Customer</button>
            </form>
            <button className="cancel-button" onClick={cancel}>Cancel</button>
        </div>
    );
}

export default UpdateCustomer;