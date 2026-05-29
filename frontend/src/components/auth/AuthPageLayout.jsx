const AuthPageLayout = ({ children }) => {
    return (
        <div className="auth-page-centered">
            {/* Background floating blobs */}
            <div className="auth-bg-shapes">
                <div className="auth-bg-shape" />
                <div className="auth-bg-shape" />
                <div className="auth-bg-shape" />
            </div>
            {children}
        </div>
    );
};

export default AuthPageLayout;
