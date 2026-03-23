import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { Toaster } from '@/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/PortectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import BrowsePetsPage from '@/pages/BrowsePetsPage.jsx';
import PetDetailPage from '@/pages/PetDetailPage.jsx';
import NgoDashboardLoginPage from '@/pages/NgoDashboardLoginPage.jsx';
import NgoDashboardRegisterPage from '@/pages/NgoDashboardRegisterPage.jsx';
import NgoDashboardPage from '@/pages/NgoDashboardPage.jsx';
import UserLoginPage from '@/pages/UserLoginPage.jsx';
import UserRegisterPage from '@/pages/UserRegisterPage.jsx';
import FavoritesPage from '@/pages/FavoritesPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<BrowsePetsPage />} />
          <Route path="/pet/:id" element={<PetDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/user-register" element={<UserRegisterPage />} />
          <Route path="/ngo-login" element={<NgoDashboardLoginPage />} />
          <Route path="/ngo-register" element={<NgoDashboardRegisterPage />} />
          <Route 
            path="/ngo-dashboard" 
            element={
              <ProtectedRoute>
                <NgoDashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;