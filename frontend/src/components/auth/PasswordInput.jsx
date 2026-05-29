import { useState } from 'react';
import { HiExclamationCircle } from 'react-icons/hi2';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const PasswordInput = ({ field, form, label, icon: Icon, placeholder, id }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { name } = field;
    const { touched, errors } = form;
    const hasError = touched[name] && errors[name];

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={id || name} className="form-label">
                    {label}
                </label>
            )}
            <div className="form-input-wrapper">
                {Icon && <Icon className="form-input-icon" />}
                <input
                    {...field}
                    id={id || name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    className={`form-input ${hasError ? 'error' : ''}`}
                    style={{ paddingRight: '3rem' }}
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <HiEyeSlash /> : <HiEye />}
                </button>
            </div>
            {hasError && (
                <div className="form-error">
                    <HiExclamationCircle />
                    <span>{errors[name]}</span>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
