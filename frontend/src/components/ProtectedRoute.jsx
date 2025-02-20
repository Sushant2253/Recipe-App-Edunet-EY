import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && !['/login', '/register'].includes(location.pathname)) {
            toast.error('Please login to continue');
        }
    }, [isAuthenticated, location.pathname]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;