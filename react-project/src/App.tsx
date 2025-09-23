import { BrowserRouter as Router, Routes, Route, Link,  } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';
import UpdateCustomer from './components/UpdateCustomer';

// Export the routes component for testing
export const AppRoutes = () => (
  <div className="App">
    <Routes>
      <Route path="/" element={<DisplayCustomers />} />
      <Route path="/add_customer/:id" element={<AddCustomer />} />
      <Route path="/delete_customer/:id" element={<DeleteCustomer />} />
      <Route path="/update_customer/:id" element={<UpdateCustomer />} />
    </Routes>
  </div>
);

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
