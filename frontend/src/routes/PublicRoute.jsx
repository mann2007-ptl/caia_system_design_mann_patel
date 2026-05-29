import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../constants';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return role === ROLES.ADMIN
            ? <Navigate to="/admin/dashboard" replace />
            : <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
