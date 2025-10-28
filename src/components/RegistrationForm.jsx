import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegistration from '../api/post-registration';

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
        
        try {
            const response = await postRegistration(formData);
            console.log('Registration successful:', response);
            // Store the token in localStorage
            localStorage.setItem('token', response.token);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message);
        }
    };

    const handleNavigation = (path) => {
        setShowSuccessPopup(false);
        navigate(path);
    };

    // 4. Render form
    return (
        <div>
            {showSuccessPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    {/* close button */}
                    <button
                        onClick={handleClosePopup}
                        aria-label="Close"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            border: 'none',
                            background: 'none',
                            fontSize: '1.3rem',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                    <h2>Welcome to Alpaca Heaven! 🦙</h2>
                    <p>Your account has been created successfully.</p>
                    <p>What would you like to do?</p>
                    
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem',
                        justifyContent: 'center'
                    }}>

                        <button
                            onClick={() => handleNavigation('/create-fundraiser')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Create a Fundraiser
                        </button>
                        <button
                            onClick={() => handleNavigation('/pledges')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Make a Pledge
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} style={{
                maxWidth: '400px',
                margin: '2rem auto',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="username" 
                        style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem' 
                        }}
                    >
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="email"
                        style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem' 
                        }}
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="first_name"
                        style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem' 
                        }}
                    >
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="last_name"
                        style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem' 
                        }}
                    >
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="password"
                        style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem' 
                        }}
                    >
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Register
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default RegistrationForm;