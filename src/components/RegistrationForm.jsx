import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegistration from '../api/post-registration';

function RegistrationForm() {
    // 1. State management for form data and errors
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 2. Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await postRegistration(formData);
            console.log('Registration successful:', response);
            navigate('/login');
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message);
        }
    };

    // 4. Render form
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default RegistrationForm;