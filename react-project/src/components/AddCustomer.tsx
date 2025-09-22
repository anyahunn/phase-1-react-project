import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCustomer.css';

function AddCustomer() {
    const [customer, setCustomer] = useState({name: "", email: "", password: "" });
    const navigate = useNavigate();
    const cancel = () => {
        navigate('/');
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('http://localhost:4000/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
        });
        navigate('/');
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