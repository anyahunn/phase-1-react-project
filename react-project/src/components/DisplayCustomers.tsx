import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCustomer from './AddCustomer';
import UpdateCustomer from './UpdateCustomer';
import './DisplayCustomers.css';

interface Customer {
	id: number;
	name: string;
	email: string;
	password: string;
}

const DisplayCustomers: React.FC<{}> = ({}) => {
	const navigate = useNavigate();
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<number | -1>(-1);
	const buttonText2 = "Delete Customer";

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = () => {
		fetch('http://localhost:4000/customers')
			.then((res) => res.json())
			.then((data) => setCustomers(data))
			.catch((err) => console.error('Failed to fetch customers:', err));
	};

	const refreshCustomers = () => {
		fetchCustomers();
		setSelectedCustomer(-1);
	};

	return (
		<div>
			<h2 className="customer-list-title">Customer List</h2>
			<table data-testid="customer-table" className="customer-table">
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
								data-testid={`customer-row-${customer.id}`}
                                onClick={() => setSelectedCustomer(isSelected ? -1 : customer.id)}
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
            
			<button
				className="delete-customer-btn"
                data-testid="delete-customer-btn"
				onClick={() => {
					if (selectedCustomer != -1) {
                        console.log(selectedCustomer);
						navigate(`/delete_customer/${selectedCustomer}`);
					} 
					
				}}
				disabled={selectedCustomer == -1}
				style={{
					backgroundColor: selectedCustomer == -1 ? '#ccc' : '',
					cursor: selectedCustomer == -1 ? 'not-allowed' : 'pointer'
				}}
			>
				{buttonText2}
			</button>

			<div style={{ marginTop: '20px' }}>
				{selectedCustomer != -1 ? (
					<UpdateCustomer 
						customerId={selectedCustomer}
						onCustomerUpdated={refreshCustomers}
						onCancel={() => setSelectedCustomer(-1)}
					/>
				) : (
					<AddCustomer 
						onCustomerAdded={refreshCustomers}
						onCancel={() => {}}
					/>
				)}
			</div>
		</div>
	);
};

export default DisplayCustomers;


