import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom";
import { useEffect } from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import CartPage from "../pages/CartPage";

// Component to handle country routing
const CountryRoute = ({ element }) => {
    const { country } = useParams();
    const navigate = useNavigate();
    const authId = localStorage.getItem("authId");
    const storedCountry = localStorage.getItem("country");

    useEffect(() => {
        // If no auth, redirect to login
        if (!authId) {
            navigate("/login", { replace: true });
            return;
        }

        // Handle country redirects
        if (storedCountry) {
            const sanitizedStoredCountry = storedCountry
                .toLowerCase()
                .replace(/\s+/g, "");

            // If no country in URL, redirect to stored country
            if (!country) {
                navigate(`/${sanitizedStoredCountry}`, { replace: true });
                return;
            }

            // If URL country doesn't match stored country, redirect
            const sanitizedUrlCountry = country
                .toLowerCase()
                .replace(/\s+/g, "");
            if (sanitizedUrlCountry !== sanitizedStoredCountry) {
                navigate(`/${sanitizedStoredCountry}`, { replace: true });
                return;
            }
        }
    }, [navigate, country, authId, storedCountry]);

    // Return element if auth is valid
    return authId ? element : null;
};

// For login/signup pages (redirect to / if already logged in)
const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    const authId = localStorage.getItem("authId");
    const storedCountry = localStorage.getItem("country");

    useEffect(() => {
        // If logged in, redirect to homepage with country
        if (authId && storedCountry) {
            const sanitizedCountry = storedCountry
                .toLowerCase()
                .replace(/\s+/g, "");
            navigate(`/${sanitizedCountry}`, { replace: true });
        }
    }, [authId, storedCountry, navigate]);

    return !authId ? children : null;
};

// Root redirect handler
const RootRedirect = () => {
    const navigate = useNavigate();
    const authId = localStorage.getItem("authId");
    const storedCountry = localStorage.getItem("country");

    useEffect(() => {
        if (authId && storedCountry) {
            const sanitizedCountry = storedCountry
                .toLowerCase()
                .replace(/\s+/g, "");
            navigate(`/${sanitizedCountry}`, { replace: true });
        } else if (!authId) {
            navigate("/login", { replace: true });
        }
    }, [navigate, authId, storedCountry]);

    return null;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route
                    path="/:country"
                    element={<CountryRoute element={<HomePage />} />}
                />
                <Route
                    path="/:country/cart"
                    element={<CountryRoute element={<CartPage />} />}
                />
                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <LoginPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <AuthRoute>
                            <SignupPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <div className="p-4 text-center">404 Not Found</div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
