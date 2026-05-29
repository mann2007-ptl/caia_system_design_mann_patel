const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
    return (
        <div className="auth-loading">
            <div className={`spinner spinner-${size} spinner-indigo`} />
            {text && <p className="auth-loading-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
