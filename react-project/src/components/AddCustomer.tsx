import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddCustomer(props: any) {
    const {id} = useParams();
    const [customer, setCustomer] = useState({id:id, name:"", email:"", password:""});
    const navigate = useNavigate();
    const cancel = () => {
        navigate('/');
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate a new id if needed
        const newCustomer = {
            id: id, // or use a better id logic
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
            <button onClick={cancel}>Cancel</button>
        </div>
    )
}

export default AddCustomer;