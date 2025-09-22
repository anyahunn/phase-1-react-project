import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as memdb from '../../../ProjectAssets/memdb.js';
import './AddCustomer.css';

function AddCustomer() {
    const { id } = useParams();
    const [customer, setCustomer] = useState({ id: id, name: "", email: "", password: "" });
    const navigate = useNavigate();
    const cancel = () => {
        navigate('/');
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate a new id if needed
        const newCustomer = {
            id: Number(id), // or use a better id logic
            name: customer.name,
            email: customer.email,
            password: customer.password
        };
        memdb.post(newCustomer);
        navigate('/'); // or '/displayCustomers' if that's your route
    };
    return (
        <div className='container'>
            <h2 className="add-customer-title">Add Customer</h2>
            <form onSubmit={handleSubmit} className="add-customer-form">
                <div className="form-group">
                    <label className="label" htmlFor="name">Name:</label>
                    <input
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
                        className="input"
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        required
                    />
                </div>
                <button className="button" type="submit">Add Customer</button>
            </form>
            <button className="button cancel" onClick={cancel}>Cancel</button>
        </div>
    );
}

export default AddCustomer;