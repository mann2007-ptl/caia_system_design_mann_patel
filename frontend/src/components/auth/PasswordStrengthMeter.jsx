import { useMemo } from 'react';

const getStrength = (password) => {
    if (!password) return { level: 0, label: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', className: 'weak' };
    if (score <= 2) return { level: 2, label: 'Fair', className: 'fair' };
    if (score <= 3) return { level: 3, label: 'Good', className: 'good' };
    return { level: 4, label: 'Strong', className: 'strong' };
};

const PasswordStrengthMeter = ({ password }) => {
    const strength = useMemo(() => getStrength(password), [password]);

    if (!password) return null;

    return (
        <div className="password-strength">
            <div className="strength-bars">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`strength-bar ${i <= strength.level ? `active ${strength.className}` : ''}`}
                    />
                ))}
            </div>
            <span className={`strength-label ${strength.className}`}>
                {strength.label}
            </span>
        </div>
    );
};

export default PasswordStrengthMeter;
