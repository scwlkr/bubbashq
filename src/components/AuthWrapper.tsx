import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DualRoleLanding from './DualRoleLanding';

interface AuthWrapperProps {
    children: React.ReactNode;
}

// Simple context to pass the location ID down to the LocationView
export const AuthContext = React.createContext<{ locationId: number | null, changeLocation: (id: number) => void }>({ locationId: null, changeLocation: () => { } });

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isAdminRoute = location.pathname === '/';
    const isUserRoute = location.pathname === '/user';

    // State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [loggedInLocationId, setLoggedInLocationId] = useState<number | null>(() => {
        const params = new URLSearchParams(window.location.search);
        const locParam = params.get('loc');
        if (locParam) {
            const id = parseInt(locParam, 10);
            if (!isNaN(id) && id > 0 && id <= 16) {
                localStorage.setItem('scwlkr_bubba_current_loc', id.toString());
                return id;
            }
        }

        const saved = localStorage.getItem('scwlkr_bubba_current_loc');
        return saved ? parseInt(saved, 10) : null;
    });

    const changeLocation = (id: number) => {
        if (id > 0 && id <= 16) {
            setLoggedInLocationId(id);
            localStorage.setItem('scwlkr_bubba_current_loc', id.toString());
            navigate(`?loc=${id}`, { replace: true });
        }
    };

    // Hardcoded simple PIN for this phase's prototype. In production, this would be a proper hashing/auth layer.
    const ADMIN_PIN = "1234";

    // If we have a saved ID, we can consider them authenticated
    useEffect(() => {
        if (loggedInLocationId !== null) {
            setIsAuthenticated(true);

            if (isUserRoute) {
                const params = new URLSearchParams(window.location.search);
                if (params.get('loc') !== loggedInLocationId.toString()) {
                    navigate(`?loc=${loggedInLocationId}`, { replace: true });
                }
            }
        }
    }, [loggedInLocationId, isUserRoute, navigate]);

    // If path changes and we aren't authenticated for that path, reset error
    useEffect(() => {
        setError('');
    }, [location.pathname]);

    const handleAdminAuth = (pin: string) => {
        if (pin === ADMIN_PIN) {
            setIsAdminAuthenticated(true);
            setError('');
            if (!isAdminRoute) navigate('/');
        } else {
            setError('Invalid Admin PIN');
        }
    };

    const handleLocationAuth = (id: number) => {
        if (!isNaN(id) && id > 0 && id <= 16) {
            setLoggedInLocationId(id);
            localStorage.setItem('scwlkr_bubba_current_loc', id.toString());
            setIsAuthenticated(true);
            setError('');
            if (!isUserRoute) {
                navigate(`/user?loc=${id}`, { replace: true });
            } else {
                navigate(`?loc=${id}`, { replace: true });
            }
        } else {
            setError('Please enter a valid Location ID (1-16)');
        }
    };

    // Render Dual-Role Landing if unauthenticated
    if ((isAdminRoute && !isAdminAuthenticated) || (isUserRoute && !isAuthenticated)) {
        return (
            <DualRoleLanding
                onAdminAuth={handleAdminAuth}
                onLocationAuth={handleLocationAuth}
                adminError={error}
                locationError={error}
                clearErrors={() => setError('')}
            />
        );
    }

    // Render children normally
    return (
        <AuthContext.Provider value={{ locationId: loggedInLocationId, changeLocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthWrapper;
