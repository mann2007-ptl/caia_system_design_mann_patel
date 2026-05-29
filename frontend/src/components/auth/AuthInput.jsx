import { HiExclamationCircle } from 'react-icons/hi2';

const AuthInput = ({ field, form, label, icon: Icon, placeholder, type = 'text', id }) => {
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
                    type={type}
                    placeholder={placeholder}
                    className={`form-input ${hasError ? 'error' : ''}`}
                    autoComplete={type === 'email' ? 'email' : 'off'}
                />
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

export default AuthInput;
