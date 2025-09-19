import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';

function App() {
  let customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
    ]
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DisplayCustomers customers={customers} />} />
          <Route path="/add_customer" element={<AddCustomer />} />
          <Route path="/delete_customer" element={<DeleteCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
