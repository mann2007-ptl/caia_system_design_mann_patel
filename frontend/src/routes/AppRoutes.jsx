import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

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
import ConceptManagement from '../pages/admin/ConceptManagement';
import CreateConcept from '../pages/admin/CreateConcept';
import EditConcept from '../pages/admin/EditConcept';
import UserManagement from '../pages/admin/UserManagement';
import UserDetails from '../pages/admin/UserDetails';
import BookmarkAnalytics from '../pages/admin/BookmarkAnalytics';
import ArchivedConcepts from '../pages/admin/ArchivedConcepts';
import Reports from '../pages/admin/Reports';
import SystemHealth from '../pages/admin/SystemHealth';
import Settings from '../pages/admin/Settings';

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
            </Route>

            {/* Admin Routes - Wrapped in AdminLayout */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminLayout /></ProtectedRoute>}>
                <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                <Route path={ROUTES.ADMIN_CONCEPTS} element={<ConceptManagement />} />
                <Route path={ROUTES.ADMIN_CONCEPT_CREATE} element={<CreateConcept />} />
                <Route path={ROUTES.ADMIN_CONCEPT_EDIT} element={<EditConcept />} />
                <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
                <Route path={ROUTES.ADMIN_USER_DETAILS} element={<UserDetails />} />
                <Route path={ROUTES.ADMIN_BOOKMARKS} element={<BookmarkAnalytics />} />
                <Route path={ROUTES.ADMIN_ARCHIVED} element={<ArchivedConcepts />} />
                <Route path={ROUTES.ADMIN_REPORTS} element={<Reports />} />
                <Route path={ROUTES.ADMIN_SYSTEM_HEALTH} element={<SystemHealth />} />
                <Route path={ROUTES.ADMIN_SETTINGS} element={<Settings />} />
            </Route>

            {/* Default redirect */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
    );
};

export default AppRoutes;
