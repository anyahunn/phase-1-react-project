import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function DeleteCustomer(props: any) {
    const { customers, deleteCustomer } = props;
    const navigate = useNavigate();
    const { id } = useParams();

    const customerId = Number(id);
    const customer = customers.find((c: any) => c.id === customerId);

    const handleDelete = () => {
        deleteCustomer(customerId);
        navigate('/'); // Go back to DisplayCustomers
    };

    if (!customer) {
        return (
            <div>
                <h2>Customer not found</h2>
                <button onClick={() => navigate('/')}>Back</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Delete Customer</h2>
            <div style={{ marginBottom: '1em', border: '1px solid #ccc', padding: '0.5em', borderRadius: '4px' }}>
                <div>
                    <strong>Name:</strong> {customer.name}
                </div>
                <div>
                    <strong>Email:</strong> {customer.email}
                </div>
                <div>
                    <strong>Password:</strong> {customer.password}
                </div>
                <button onClick={handleDelete} style={{ marginTop: '0.5em' }}>
                    Confirm Delete
                </button>
                <button onClick={() => navigate('/')} style={{ marginLeft: '0.5em' }}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default DeleteCustomer;