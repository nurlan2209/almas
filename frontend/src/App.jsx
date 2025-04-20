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
import Search from './pages/Search/Search';
import { AuthProvider } from './services/authService';

// Компонент для защиты маршрутов, требующих авторизации
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Импорт компонентов административной панели
import AdminLogin from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {/* Исключаем Header для маршрутов администратора */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
    
          <main className="main-content">
            <Routes>
              {/* Маршруты основного сайта */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-to-donate" element={<HowToDonate />} />
              <Route path="/donation-centers" element={<DonationCenters />} />
              
              {/* Защищенный маршрут для поиска доноров/реципиентов */}
              <Route 
                path="/search" 
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } 
              />
              
              {/* Маршруты административной панели */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute adminRequired={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Исключаем Footer для маршрутов администратора */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;