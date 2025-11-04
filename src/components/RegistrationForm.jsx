import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegistration from '../api/post-registration';
import alpacaIcon from "../assets/alpaca.png";
import './RegistrationForm.css';

function RegistrationForm() {
    const navigate = useNavigate();
    
    // State for form data
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await postRegistration(formData);
            console.log('Registration successful:', response);
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.message || 'Registration failed. Please try again.');
        }
    };

    // Handle success popup close
    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate('/login');
    };

    return (
        <div className="registration-form-container">
            {showSuccessPopup && (
                <div className="success-popup">
                    <button 
                        onClick={handleClosePopup}
                        aria-label="Close"
                        className="close-button"
                    >
                        ×
                    </button>
                    <h2>Registration Successful! 🎉</h2>
                    <p>Your account has been created successfully.</p>
                    <p>Click the X to go to login page.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
                {/* Add title with alpaca icon like login */}
                <h2>
                    <img src={alpacaIcon} alt="Alpaca" className="registration-title-icon" />
                    Join the Herd!
                </h2>

                {error && (
                    <div className="error-message">
                        <div className="error-content">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Enter your last name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn-register">Register</button>
                
                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
}

export default RegistrationForm;