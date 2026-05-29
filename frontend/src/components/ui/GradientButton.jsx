const GradientButton = ({ children, loading, disabled, type = 'submit', onClick }) => {
    return (
        <button
            type={type}
            className="gradient-btn"
            disabled={loading || disabled}
            onClick={onClick}
        >
            <span>
                {loading && <div className="spinner" />}
                {children}
            </span>
        </button>
    );
};

export default GradientButton;
