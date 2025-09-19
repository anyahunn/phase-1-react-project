import { BrowserRouter as Router, Routes, Route, Link,  } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';
import UpdateCustomer from './components/UpdateCustomer';

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

  const deleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const findHighestId = () => {
    return customers.reduce((maxId, customer) => Math.max(maxId, customer.id), 0) + 1;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DisplayCustomers customers={customers} customer={null} />} />
          <Route path="/add_customer/:id" element={<AddCustomer id={findHighestId()} addCustomer={addCustomer} />} />
          <Route path="/delete_customer/:id" element={<DeleteCustomer customers={customers} deleteCustomer={deleteCustomer}/>} />
          <Route path="/update_customer/:id" element={<UpdateCustomer customers={customers} updateCustomer={updateCustomer} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
