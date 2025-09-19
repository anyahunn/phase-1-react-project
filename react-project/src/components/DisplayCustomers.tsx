import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll } from '../../../ProjectAssets/memdb.js';
import './DisplayCustomers.css';

interface Customer {
	id: number;
	name: string;
	email: string;
	password: string;
}

const DisplayCustomers: React.FC = () => {
	const navigate = useNavigate();
	//const [customers, setCustomers] = useState<Customer[]>([]); Use for v2 and v3
	const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

    //Dont use this until v3 
	// useEffect(() => {
	// 	fetch('http://localhost:4000/customers')
	// 		.then((res) => res.json())
	// 		.then((data) => setCustomers(data))
	// 		.catch((err) => console.error('Failed to fetch customers:', err));
	// }, []);

    //Dont use until v2
    // useEffect(() => {
    //     const data = getAll('customers') as Customer[];
    //     setCustomers(data);
    // }, []);

    let customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
    ]

	return (
		<div>
			<h2 className="customer-list-title">Customer List</h2>
			<table className="customer-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Password</th>
					</tr>
				</thead>
				<tbody>
					{customers.map((customer) => {
						const isSelected = selectedCustomer === customer.id;
						return (
							<tr
								key={customer.id}
								className={isSelected ? 'selected-row' : ''}
								onClick={() => setSelectedCustomer(isSelected ? null : customer.id)}
							>
								<td>{customer.id}</td>
								<td>{customer.name}</td>
								<td>{customer.email}</td>
								<td>{customer.password}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<button className="add-customer-btn" onClick={() => navigate('/add_customer')}>Add Customer</button>
		</div>
	);
};

export default DisplayCustomers;
