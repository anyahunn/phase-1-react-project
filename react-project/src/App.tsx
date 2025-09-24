import { useState } from 'react';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';

function App() {
  const [customers, setCustomers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
    ]);

  const addCustomer = (newCustomer:any) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (updatedCustomer:any) => {
    setCustomers(prev =>
      prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
  };

  const deleteCustomer = (id:number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const findHighestId = () => {
    return customers.reduce((maxId, customer) => Math.max(maxId, customer.id), 0) + 1;
  }

  return (
    <>
      <h1>Customer Management System</h1>
      <DisplayCustomers
        customers={customers}
        addCustomer={addCustomer}
        updateCustomer={updateCustomer}
        deleteCustomer={deleteCustomer}
        findHighestId={findHighestId}
      />
    </>
  );
}

export default App
