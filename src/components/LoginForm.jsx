import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import postLogin from "../api/post-login.js";
import alpacaIcon from "../assets/alpaca.png";  
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/';
  const loginMessage = location.state?.message;

  const [credentials, setCredentials] = useState({
      username: "",
      password: "",
  });

  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
      const { id, value } = event.target;
      setCredentials((prevCredentials) => ({
          ...prevCredentials,
          [id]: value,
      }));
      setError("");
      setErrorType("");
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      setError("");
      setErrorType("");
      setLoading(true);

      if (!credentials.username) {
          setError("Username is required");
          setErrorType("username");
          setLoading(false);
          return;
      }

      if (!credentials.password) {
          setError("Password is required");
          setErrorType("password");
          setLoading(false);
          return;
      }

      try {
          const response = await postLogin(
              credentials.username,
              credentials.password
          );

          console.log("✅ API Response:", response);

          // Store token
          if (response.token) {
              localStorage.setItem("token", response.token);
              console.log("✅ Token stored:", response.token);
          }
          
          // Store user data (backend returns user_id and email)
          if (response.user_id) {
              localStorage.setItem("user", JSON.stringify({
                  id: parseInt(response.user_id), // ← ADD parseInt() HERE
                  email: response.email,
                  username: credentials.username
              }));
              console.log("✅ User stored");
          }

          console.log("✅ Login successful!");
          setSuccess(true);
          setLoading(false);

          // Redirect after showing success message
          setTimeout(() => {
              console.log("Redirecting to:", returnTo);
              navigate(returnTo, { replace: true }); // Uses returnTo instead of "/"
              
              // Force refresh to update NavBar
              setTimeout(() => {
                  window.location.reload();
              }, 500);
          }, 1500);
          
      } catch (err) {
          console.error("❌ Login error:", err);
          setLoading(false);

          const errorMessage = err.message || "";

          if (errorMessage.includes("not found") || errorMessage.includes("does not exist")) {
              setError("Username not found. Don't have an account?");
              setErrorType("username-not-found");
          } else if (errorMessage.includes("incorrect") || errorMessage.includes("Invalid")) {
              setError("Username or password is incorrect");
              setErrorType("credentials");
          } else if (errorMessage.includes("inactive")) {
              setError("This account is inactive. Please contact support.");
              setErrorType("inactive");
          } else {
              setError(errorMessage || "Login failed. Please try again.");
              setErrorType("general");
          }
      }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
    <h2>
        <img src={alpacaIcon} alt="Alpaca" className="login-title-icon" />
        Welcome Back!
    </h2>

  {loginMessage && (
      <div className="info-message">
          <div className="info-content">
              <span className="info-icon">ℹ️</span>
              <p>{loginMessage}</p>
          </div>
      </div>
  )}

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <div className="success-text">
              <p>Login successful!</p>
              <p className="success-subtext">Redirecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className={`error-message error-${errorType}`}>
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <p>{error}</p>
                
                {errorType === "username-not-found" && (
                  <Link to="/register" className="error-cta">
                    Create an account →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              className={errorType === "username" ? "input-error" : ""}
              required
              disabled={loading || success}
          />
          {errorType === "username" && (
            <span className="field-error">Username is required</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className={errorType === "password" ? "input-error" : ""}
              required
              disabled={loading || success}
          />
          {errorType === "password" && (
            <span className="field-error">Password is required</span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-login"
          disabled={loading || success}
        >
          {success ? "✅ Logged in! Redirecting..." : loading ? "Logging in..." : "Login"}
        </button>

        {!success && (
          <>
            <p className="register-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

            <p className="forgot-password">
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
}

export default LoginForm;