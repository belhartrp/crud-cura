import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Report from './pages/Report';
import Seeker from './pages/Seeker';
import { ReportProvider } from './contexts/ReportContext';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container">
      <Link className="navbar-brand" to="/">CURA</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/report">Report</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/seeker">Seeker</Link></li>
        </ul>
      </div>
    </div>
  </nav>
);

function App() {
  const [userProfile, setUserProfile] = useState(null);
  return (
    <ReportProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home userProfile={userProfile} />} />
          <Route path="/profile" element={<Profile userProfile={userProfile} setUserProfile={setUserProfile} />} />
          <Route path="/report" element={<Report />} />
          <Route path="/seeker" element={<Seeker />} />
        </Routes>
      </Router>
    </ReportProvider>
  );
}

export default App;
