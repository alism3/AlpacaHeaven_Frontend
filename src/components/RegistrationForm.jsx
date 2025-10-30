import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegistration from '../api/post-registration';
import './RegistrationForm.css';  // Add this import

function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await postRegistration(formData);
            console.log('Registration successful:', response);
            localStorage.setItem('token', response.token);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message);
        }
    };

    return (
        <div>
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

            <form onSubmit={handleSubmit} className="registration-form-container">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="first_name" className="form-label">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last_name" className="form-label">Last Name:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <button type="submit" className="form-button">Register</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default RegistrationForm;