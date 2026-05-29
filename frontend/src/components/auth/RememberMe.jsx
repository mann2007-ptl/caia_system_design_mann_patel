const RememberMe = ({ checked, onChange }) => {
    return (
        <label className="remember-me">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                id="remember-me"
            />
            <span className="remember-me-label">Remember me</span>
        </label>
    );
};

export default RememberMe;
