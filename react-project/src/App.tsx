import { BrowserRouter as Router, Routes, Route, Link,  } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';

function App() {
  const [customers, setCustomers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
    ]);

  const addCustomer = (newCustomer:any) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DisplayCustomers customers={customers} customer={null} />} />
          <Route path="/add_customer/:id" element={<AddCustomer id={customers.length} addCustomer={addCustomer} />} />
          <Route path="/delete_customer/:id" element={<DeleteCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
