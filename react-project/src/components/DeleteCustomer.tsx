import React, { useState } from 'react';

type Customer = {
    name: string;
    email: string;
    password: string;
};

const initialCustomers: Customer[] = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'securepass' },
];

function DeleteCustomer() {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

    const handleDelete = (index: number) => {
        setCustomers(customers.filter((_, idx) => idx !== index));
    };

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map((customer, idx) => (
                    <li key={idx}>
                        <strong>Name:</strong> {customer.name} <br />
                        <strong>Email:</strong> {customer.email} <br />
                        <strong>Password:</strong> {customer.password} <br />
                        <button onClick={() => handleDelete(idx)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteCustomer;