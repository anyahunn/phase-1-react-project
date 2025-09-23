import React, { useState, useEffect } from 'react';
import * as memdb from '../../../ProjectAssets/memdb.js';

interface Customer {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface CustomerFormProps {
    selectedCustomer: Customer | null;
    nextId: number;
    onCustomerSaved: () => void;
    onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
    selectedCustomer, 
    nextId, 
    onCustomerSaved, 
    onCancel 
}) => {
    const [customer, setCustomer] = useState({
        id: selectedCustomer?.id || nextId,
        name: '',
        email: '',
        password: ''
    });

    const isUpdateMode = selectedCustomer !== null;

    useEffect(() => {
        if (selectedCustomer) {
            setCustomer({
                id: selectedCustomer.id,
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                password: selectedCustomer.password
            });
        } else {
            setCustomer({
                id: nextId,
                name: '',
                email: '',
                password: ''
            });
        }
    }, [selectedCustomer, nextId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const customerData = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            password: customer.password
        };

        if (isUpdateMode) {
            memdb.put(customer.id, customerData);
        } else {
            memdb.post(customerData);
        }

        onCustomerSaved();
    };

    const handleCancel = () => {
        setCustomer({
            id: nextId,
            name: '',
            email: '',
            password: ''
        });
        onCancel();
    };

    return (
        <div className='customer-form-container'>
            <h2 data-testid={isUpdateMode ? "update-customer-title" : "add-customer-title"} 
                className="customer-form-title">
                {isUpdateMode ? 'Update Customer' : 'Add Customer'}
            </h2>
            <form onSubmit={handleSubmit} 
                  data-testid={isUpdateMode ? "update-customer-form" : "add-customer-form"}
                  className="customer-form">
                <div className="form-group">
                    <label className="label" htmlFor="name">Name:</label>
                    <input
                        data-testid="name-input"
                        className="input"
                        type="text"
                        id="name"
                        placeholder="Enter name"
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
                        placeholder="Enter email"
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
                        placeholder="Enter password"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        required
                    />
                </div>
                <button 
                    data-testid={isUpdateMode ? "submit-button" : "add-customer-submit"}
                    className="button" 
                    type="submit">
                    {isUpdateMode ? 'Update Customer' : 'Add Customer'}
                </button>
            </form>
            <button className="button cancel" onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default CustomerForm;
