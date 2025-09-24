import React, { useEffect, useState } from 'react';
import { getAll } from '../../../ProjectAssets/memdb.js';
import AddCustomer from './AddCustomer';
import UpdateCustomer from './UpdateCustomer';
import './DisplayCustomers.css';

interface Customer {
	id: number;
	name: string;
	email: string;
	password: string;
}

interface DisplayCustomersProps {
	customers: Customer[];
	addCustomer: (customer: Customer) => void;
	updateCustomer: (customer: Customer) => void;
	deleteCustomer: (id: number) => void;
	findHighestId: () => number;
}

const DisplayCustomers: React.FC<DisplayCustomersProps> = ({ 
	customers, 
	addCustomer, 
	updateCustomer, 
	deleteCustomer, 
	findHighestId 
}) => {
	const [selectedCustomer, setSelectedCustomer] = useState<number>(-1);
	const [refreshKey, setRefreshKey] = useState<number>(0);

	const refreshCustomers = () => {
		setRefreshKey(prev => prev + 1);
		setSelectedCustomer(-1);
	};
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

    // useEffect(() => {
    //     if (customer){
    //         customers = [...customers, customer];
    //     }
    // })

	return (
		<div>
			<h2 className="customer-list-title">Customer List</h2>
			<table className="customer-table" data-testid="customer-table">
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
							<tr data-testid={`customer-row-${customer.id}`}
								key={customer.id}
								className={isSelected ? 'selected-row' : ''}
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
				data-testid="delete-customer-button"
				onClick={() => {
					if (selectedCustomer !== -1) {
						deleteCustomer(selectedCustomer);
						refreshCustomers();
					}
				}}
				disabled={selectedCustomer === -1}
				style={{
					backgroundColor: selectedCustomer === -1 ? '#ccc' : '',
					cursor: selectedCustomer === -1 ? 'not-allowed' : 'pointer'
				}}
			>
				Delete Customer
			</button>

			<div style={{ marginTop: '20px' }}>
				{selectedCustomer !== -1 ? (
					<UpdateCustomer 
						key={`update-${selectedCustomer}-${refreshKey}`}
						customers={customers}
						updateCustomer={(customer: Customer) => {
							updateCustomer(customer);
							refreshCustomers();
						}}
						customerId={selectedCustomer}
						onCancel={() => setSelectedCustomer(-1)}
					/>
				) : (
					<AddCustomer 
						key={`add-${findHighestId()}-${refreshKey}`}
						id={findHighestId()}
						addCustomer={(customer: Customer) => {
							addCustomer(customer);
							refreshCustomers();
						}}
						onCancel={() => {}}
					/>
				)}
			</div>
		</div>
	);
};

export default DisplayCustomers;


