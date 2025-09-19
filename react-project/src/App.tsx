import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
//import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              {/* <Link to="/customers">Display Customers</Link> */}
              <Link to="/add_customer">Add Customer</Link>
            </li>
            <li>
              <Link to="/delete_customer">Delete Customer</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          {/* <Route path="/customers" element={<DisplayCustomers />} /> */}
          <Route path="/add_customer" element={<AddCustomer />} />
          <Route path="/delete_customer" element={<DeleteCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
