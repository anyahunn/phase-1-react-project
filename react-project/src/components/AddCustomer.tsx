import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as memdb from '../../../ProjectAssets/memdb.js';
import './AddCustomer.css';

interface AddCustomerProps {
    id?: number;
    onCustomerAdded?: () => void;
    onCancel?: () => void;
}

function AddCustomer({ id: propId, onCustomerAdded, onCancel }: AddCustomerProps = {}) {
    const { id: paramId } = useParams();
    const id = propId || Number(paramId);
    const [customer, setCustomer] = useState({ id: id, name: "", email: "", password: "" });
    const navigate = useNavigate();
    
    const cancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/');
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCustomer = {
            id: Number(id),
            name: customer.name,
            email: customer.email,
            password: customer.password
        };
        memdb.post(newCustomer);
        
        // Clear form after submission
        setCustomer({ id: Number(id) + 1, name: "", email: "", password: "" });
        
        if (onCustomerAdded) {
            onCustomerAdded();
        } else {
            navigate('/');
        }
    };
    return (
        <div className='container'>
            <h2 data-testid="add-customer-title" className="add-customer-title">Add Customer</h2>
            <form onSubmit={handleSubmit} data-testid="add-customer-form" className="add-customer-form">
                <div className="form-group">
                    <label className="label" htmlFor="name">Name:</label>
                    <input
                        data-testid="name-input"
                        className="input"
                        type="text"
                        id="name"
                        placeholder="Name"
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
                        placeholder="Email"
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
                        placeholder="Password"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        required
                    />
                </div>
                <button data-testid="add-customer-submit" className="button" type="submit">Add Customer</button>
            </form>
            <button className="button cancel" onClick={cancel}>Cancel</button>
        </div>
    );
}

export default AddCustomer;