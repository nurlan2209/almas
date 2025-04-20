// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import HowToDonate from './pages/HowToDonate/HowToDonate';
import DonationCenters from './pages/DonationCenters/DonationCenters';
import { AuthProvider } from './services/authService';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
    
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-to-donate" element={<HowToDonate />} />
              <Route path="/donation-centers" element={<DonationCenters />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;