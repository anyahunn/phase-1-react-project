import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DisplayCustomers from './components/DisplayCustomers';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/customers">Display Customers</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/customers" element={<DisplayCustomers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
