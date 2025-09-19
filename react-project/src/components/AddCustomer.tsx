import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCustomer(props: any) {
    const [customer, setCustomer] = useState({id:props.id, name:"", email:"", password:""});
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate a new id if needed
        const newCustomer = {
            id: props.id, // or use a better id logic
            name: customer.name,
            email: customer.email,
            password: customer.password
        };
        props.addCustomer(newCustomer);
        navigate('/'); // or '/displayCustomers' if that's your route
    };
    return(
        <div className='page'>
            <h2>Add Customer</h2>
            <form onSubmit={handleSubmit}>
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
                        type="text"
                        id="Password"
                        placeholder="Enter your password"
                        value={customer.password}
                        onChange={(e) => setCustomer({...customer, password: e.target.value})}
                    />
                </div>

                <button type="submit">Add Customer</button>
            </form>
        </div>
    )
}

export default AddCustomer;