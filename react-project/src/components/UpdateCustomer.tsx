import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as memdb from '../../../ProjectAssets/memdb.js';
import './UpdateCustomer.css';

function UpdateCustomer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ id: Number(id), name: '', email: '', password: '' });

    useEffect(() => {
        const existingCustomer = memdb.get(Number(id));
        if (existingCustomer) {
            setCustomer({ id: existingCustomer.id, name: existingCustomer.name, email: existingCustomer.email, password: existingCustomer.password });
        }
    }, [id]);

    const cancel = () => {
        navigate('/');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCustomer = {
            id: Number(id),
            name: customer.name,
            email: customer.email,
            password: customer.password
        };
        memdb.put(Number(updatedCustomer.id), updatedCustomer);
        navigate('/');
    };

    return (
        <div className='container'>
            <h2 className="update-customer-title">Update Customer</h2>
            <form onSubmit={handleSubmit} className="update-customer-form">
                <div className="form-group">
                    <label className="label" htmlFor="name">Name:</label>
                    <input
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
                        className="input"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        required
                    />
                </div>
                <button className="submit-button" type="submit">Update Customer</button>
            </form>
            <button className="button-cancel" onClick={cancel}>Cancel</button>
        </div>
    );
}

export default UpdateCustomer;