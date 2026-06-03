import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

// User Pages
import Dashboard from '../pages/user/Dashboard';
import ConceptExplorer from '../pages/user/ConceptExplorer';
import ConceptDetails from '../pages/user/ConceptDetails';
import Bookmarks from '../pages/user/Bookmarks';
import Archived from '../pages/user/Archived';
import Profile from '../pages/user/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

import { ROLES, ROUTES } from '../constants';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Auth Routes */}
            <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
            <Route path={ROUTES.REGISTER} element={<PublicRoute><Register /></PublicRoute>} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path={ROUTES.RESET_PASSWORD} element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

            {/* Application Routes - Wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                {/* User Routes */}
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.CONCEPTS} element={<ConceptExplorer />} />
                <Route path={ROUTES.CONCEPT_DETAILS} element={<ConceptDetails />} />
                <Route path={ROUTES.BOOKMARKS} element={<Bookmarks />} />
                <Route path={ROUTES.ARCHIVED} element={<Archived />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />

                {/* Admin Routes */}
                <Route
                    path={ROUTES.ADMIN}
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Default redirect */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
    );
};

export default AppRoutes;
