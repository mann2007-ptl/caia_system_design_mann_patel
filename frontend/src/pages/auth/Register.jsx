import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineArrowRight,
    HiOutlineUserPlus,
} from 'react-icons/hi2';

import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import GradientButton from '../../components/ui/GradientButton';
import { registerUser } from '../../features/auth/authSlice';
import { VALIDATION, ROLES } from '../../constants';

const registerSchema = Yup.object().shape({
    name: Yup.string().required(VALIDATION.NAME_REQUIRED),
    email: Yup.string()
        .email(VALIDATION.EMAIL_INVALID)
        .required(VALIDATION.EMAIL_REQUIRED),
    password: Yup.string()
        .min(6, VALIDATION.PASSWORD_MIN)
        .required(VALIDATION.PASSWORD_REQUIRED),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], VALIDATION.PASSWORD_MATCH)
        .required(VALIDATION.CONFIRM_PASSWORD_REQUIRED),
});

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await dispatch(
                registerUser({ name: values.name, email: values.email, password: values.password })
            ).unwrap();

            toast.success('Account created successfully!', {
                icon: '🎉',
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });

            const role = result.user?.role;
            if (role === ROLES.ADMIN) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            toast.error(err || 'Registration failed.', {
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Account — CAIA Platform</title>
                <meta name="description" content="Create your CAIA Platform account." />
            </Helmet>

            <AuthPageLayout>
                <AuthCard>
                    <div className="auth-card-header">
                        <div className="auth-card-icon">
                            <HiOutlineUserPlus />
                        </div>
                        <h2 className="auth-card-title">Create Account</h2>
                        <p className="auth-card-subtitle">
                            Join CAIA Platform and start designing smarter.
                        </p>
                    </div>

                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, isSubmitting }) => (
                            <Form noValidate>
                                <Field
                                    name="name"
                                    component={AuthInput}
                                    label="Full Name"
                                    icon={HiOutlineUser}
                                    placeholder="John Doe"
                                    type="text"
                                    id="register-name"
                                />

                                <Field
                                    name="email"
                                    component={AuthInput}
                                    label="Email Address"
                                    icon={HiOutlineEnvelope}
                                    placeholder="you@example.com"
                                    type="email"
                                    id="register-email"
                                />

                                <Field
                                    name="password"
                                    component={PasswordInput}
                                    label="Password"
                                    icon={HiOutlineLockClosed}
                                    placeholder="Create a strong password"
                                    id="register-password"
                                />
                                <PasswordStrengthMeter password={values.password} />

                                <div style={{ marginTop: '0.5rem' }}>
                                    <Field
                                        name="confirmPassword"
                                        component={PasswordInput}
                                        label="Confirm Password"
                                        icon={HiOutlineLockClosed}
                                        placeholder="Confirm your password"
                                        id="register-confirm-password"
                                    />
                                </div>

                                <GradientButton loading={loading || isSubmitting}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    {!loading && <HiOutlineArrowRight />}
                                </GradientButton>
                            </Form>
                        )}
                    </Formik>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </AuthCard>
            </AuthPageLayout>
        </>
    );
};

export default Register;
