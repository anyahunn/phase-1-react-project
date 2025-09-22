import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DeleteCustomer.css';

function DeleteCustomer() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [customer, setCustomer] = useState<any>(null);

    useEffect(() => {
      fetch(`http://localhost:4000/customers/${id}`)
        .then(res => res.json())
        .then(data => setCustomer(data));
    }, [id]);

    const handleDelete = async () => {
      await fetch(`http://localhost:4000/customers/${id}`, { method: 'DELETE' });
      navigate('/');
    };

    if (!customer) {
      return (
        <div className="container">
          <h2 className="title">Customer not found</h2>
          <button className="button" onClick={() => navigate('/')}>Back</button>
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
              <button className="button" onClick={handleDelete}>Confirm Delete</button>
              <button className="button cancel" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </div>
        </div>
      );
}

export default DeleteCustomer;