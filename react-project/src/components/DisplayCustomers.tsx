import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import { getAll } from '../../../ProjectAssets/memdb.js';
import './DisplayCustomers.css';

interface Customer {
	id: number;
	name: string;
	email: string;
	password: string;
}

const DisplayCustomers: React.FC<{}> = ({}) => {
	const navigate = useNavigate();
	const [customers, setCustomers] = useState<Customer[]>([]); //Use for v2 and v3
	const [selectedCustomer, setSelectedCustomer] = useState<number | -1>(-1);
    const buttonText = selectedCustomer != -1 ? "Update Customer" : "Add Customer";
	const buttonText2 = "Delete Customer";
    //Dont use this until v3 
	useEffect(() => {
		fetch('http://localhost:4000/customers')
			.then((res) => res.json())
			.then((data) => setCustomers(data))
			.catch((err) => console.error('Failed to fetch customers:', err));
	}, []);

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
				className="add-customer-btn"
                data-testid="add-customer-btn"
				onClick={() => {
					if (selectedCustomer != -1) {
                        console.log(customers.length);
						navigate(`/update_customer/${selectedCustomer}`);
					} else {
                        console.log(customers.length);
						navigate(`/add_customer/${customers.length + 1}`);
					}
				}}
			>
				{buttonText}
			</button>

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
		</div>
	);
};

export default DisplayCustomers;


