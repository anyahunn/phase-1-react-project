import React, { useState } from 'react';
import './AddCustomer.css';

function AddCustomer(props: any) {
    const { id, onCancel, addCustomer } = props;
    const [customer, setCustomer] = useState({id: id, name: "", email: "", password: ""});
    
    const cancel = () => {
        if (onCancel) {
            onCancel();
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
        addCustomer(newCustomer);
        // Clear form after submission
        setCustomer({id: id, name: "", email: "", password: ""});
    };
    return(
        <div className='page'>
            <h2 data-testid='add-customer-title' className="add-customer-title">Add Customer</h2>
            <form onSubmit={handleSubmit} className="add-customer-form" data-testid="add-customer-form">
                <div>
                    {/* <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        placeholder="Enter id"
                        value={customer.id}
                        onChange={(e) => setCustomer({...customer, id: e.target.value})}
                    /> */}

                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        data-testid="name-input"
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                </div>
                <div>

                    <label htmlFor="email">Email:</label>
                    <input
                        data-testid="email-input"
                        type="text"
                        id="email"
                        placeholder="Enter your email"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        data-testid="password-input"
                        type="text"
                        id="Password"
                        placeholder="Enter your password"
                        value={customer.password}
                        onChange={(e) => setCustomer({...customer, password: e.target.value})}
                    />
                </div>

                <button type="submit" data-testid="add-customer-submit">Add Customer</button>
            </form>
            <button className="cancel-button" onClick={cancel}>Cancel</button>
        </div>
    )
}

export default AddCustomer;