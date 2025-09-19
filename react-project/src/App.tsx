import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DisplayCustomers />} />
          <Route path="/add_customer" element={<AddCustomer />} />
          <Route path="/delete_customer" element={<DeleteCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
