import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

const InitialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const country = localStorage.getItem('country');
    if (country) {
      navigate(`/${country.toLowerCase()}`, { replace: true });
    }
  }, [navigate]);

  return null;
};

// New component to protect country routes
const CountryRouteProtection = ({ children }) => {
  const { country } = useParams();
  const storedCountry = localStorage.getItem('country');

  // If the country in URL doesn't match localStorage, redirect to correct country
  if (country && storedCountry && country.toLowerCase() !== storedCountry.toLowerCase()) {
    return <Navigate to={`/${storedCountry.toLowerCase()}`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <InitialRedirect />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/:country" element={
          <ProtectedRoute>
            <CountryRouteProtection>
              <HomePage />
            </CountryRouteProtection>
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        } />
        <Route path="*" element={<div className="p-4 text-center">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

// For protected routes (require auth)
const ProtectedRoute = ({ children }) => {
  const authId = localStorage.getItem('authId');
  return authId ? children : <Navigate to="/login" replace />;
};

// For auth routes (login/signup - should not be accessible when logged in)
const AuthRoute = ({ children }) => {
  const authId = localStorage.getItem('authId');
  return !authId ? children : <Navigate to="/" replace />;
};

export default App;