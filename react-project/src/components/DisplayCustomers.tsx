import React, { useEffect, useState } from 'react';

interface Customer {
	id: number;
	name: string;
	email: string;
	password: string;
}

const DisplayCustomers: React.FC = () => {
	const [customers, setCustomers] = useState<Customer[]>([]);

	useEffect(() => {
		fetch('http://localhost:4000/customers')
			.then((res) => res.json())
			.then((data) => setCustomers(data))
			.catch((err) => console.error('Failed to fetch customers:', err));
	}, []);

		const renderCustomerRows = () => {
			return customers.map((customer) => (
				<tr key={customer.id}>
					<td>{customer.id}</td>
					<td>{customer.name}</td>
					<td>{customer.email}</td>
					<td>{customer.password}</td>
				</tr>
			));
		};

		return (
			<div>
				<h2>All Customers</h2>
				<table border={1} cellPadding={8}>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Password</th>
						</tr>
					</thead>
					<tbody>
						{renderCustomerRows()}
					</tbody>
				</table>
			</div>
		);
};

export default DisplayCustomers;
