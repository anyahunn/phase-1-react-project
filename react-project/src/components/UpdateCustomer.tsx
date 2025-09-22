import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateCustomer.css';

function UpdateCustomer(props: any) {
    const navigate = useNavigate();
    const { id } = useParams();
    const customerId = Number(id);
    const selectedCustomer = props.customers.find((c: any) => c.id === customerId);
    const [customer, setCustomer] = useState(selectedCustomer || {id: customerId, name: '', email: '', password: ''});
    const cancel = () => {
        navigate('/');
    }

    useEffect(() => {
        if (selectedCustomer) {
            setCustomer(selectedCustomer);
        }
    }, [selectedCustomer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCustomer = {
            id: customerId,
            name: customer.name,
            email: customer.email,
            password: customer.password
        };
        props.updateCustomer(updatedCustomer);
        navigate('/');
    };

    return(
        <div className='page'>
            <h2 className='update-customer-title'>Update Customer</h2>
            <form onSubmit={handleSubmit} className="update-customer-form" data-testid="update-customer-form">
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
                <button type="submit" data-testid='submit-button'>Update Customer</button>
            </form>
            <button className='cancel-button' onClick={cancel}>Cancel</button>
        </div>
    )
}

export default UpdateCustomer;