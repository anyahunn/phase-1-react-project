import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const DisplayCustomers: React.FC<{}> = ({}) => {
	const navigate = useNavigate();
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<number | -1>(-1);
	const [refreshKey, setRefreshKey] = useState<number>(0);
	const buttonText2 = "Delete Customer";

    useEffect(() => {
        const data = getAll('customers') as Customer[];
        setCustomers(data);
    }, []);

	const refreshCustomers = () => {
		// Use setTimeout to ensure memdb operations complete before refresh
		setTimeout(() => {
			const data = getAll('customers') as Customer[];
			setCustomers([...data]); // Force new array reference to trigger re-render
			setSelectedCustomer(-1);
			setRefreshKey(prev => prev + 1); // Force component re-render
		}, 0);
	};

	return (
		<div>
			<h2 className="customer-list-title">Customer List</h2>
			<table key={`table-${refreshKey}`} data-testid="customer-table" className="customer-table">
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
								data-testid={`customer-row-${customer.id}`}
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
				onClick={() => {
					if (selectedCustomer != -1) {
                        console.log(selectedCustomer);
						navigate(`/delete_customer/${selectedCustomer}`);
					} else {
                        console.log(customers.length);
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
						key={`update-${selectedCustomer}-${refreshKey}`}
						customerId={selectedCustomer}
						onCustomerUpdated={refreshCustomers}
						onCancel={() => setSelectedCustomer(-1)}
					/>
				) : (
					<AddCustomer 
						key={`add-${customers.length + 1}-${refreshKey}`}
						id={customers.length + 1}
						onCustomerAdded={refreshCustomers}
						onCancel={() => {}}
					/>
				)}
			</div>
		</div>
	);
};

export default DisplayCustomers;


