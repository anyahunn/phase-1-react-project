import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as memdb from '../../../ProjectAssets/memdb.js';
import './DeleteCustomer.css';

function DeleteCustomer() {
    const navigate = useNavigate();
    const { id } = useParams();
    const customerId = Number(id);
    const [customer, setCustomer] = useState<any>(null);

    useEffect(()=> {
        setCustomer(memdb.get(customerId));
    }, [customerId]);

    const handleDelete = () => {
        memdb.deleteById(customerId);
        navigate('/'); 
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
        <div className="container">
          <h2 className="title">Delete Customer</h2>
          <div className="delete-customer-details">
            <div className="form-group">
              <span className="label"><strong>Name:</strong></span>
              <span className="text">{customer.name}</span>
            </div>
            <div className="form-group">
              <span className="label"><strong>Email:</strong></span>
              <span className="text">{customer.email}</span>
            </div>
            <div className="form-group">
              <span className="label"><strong>Password:</strong></span>
              <span className="text">{customer.password}</span>
            </div>
            <div className="button-group">
              <button className="button" onClick={handleDelete} data-testid="confirm-delete-button">Confirm Delete</button>
              <button className="button cancel" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </div>
        </div>
      );
}

export default DeleteCustomer;