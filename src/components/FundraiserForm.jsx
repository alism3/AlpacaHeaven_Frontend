import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postFundraiser from '../api/post-fundraiser';
import './FundraiserForm.css'; 

function FundraiserForm() {
    const [fundraiserData, setFundraiserData] = useState({
        title: '',
        description: '',
        goal: '',
        image: '',
        is_open: true
    });
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFundraiserData({
            ...fundraiserData,
            [e.target.name]: e.target.value
        });
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await postFundraiser(fundraiserData);
            console.log('Fundraiser created:', response);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error('Error creating fundraiser:', err);
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
                    <h2>Fundraiser Created! 🎉</h2>
                    <p>Your fundraiser has been created successfully.</p>
                    <p>Click the X to return to homepage.</p>
                </div>
            )}

            <h2>Create a New Fundraiser</h2>
            <form onSubmit={handleSubmit} className="fundraiser-form-container">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={fundraiserData.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={fundraiserData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="form-textarea"
                    />
                </div>        

                <div className="form-group">
                    <label htmlFor="goal" className="form-label">Goal Amount ($):</label>
                    <input
                        type="number"
                        id="goal"
                        name="goal"
                        value={fundraiserData.goal}
                        onChange={handleChange}
                        required
                        min="0"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image" className="form-label">Image URL:</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={fundraiserData.image}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="is_open"
                            checked={fundraiserData.is_open}
                            onChange={(e) => setFundraiserData({
                                ...fundraiserData,
                                is_open: e.target.checked
                            })}
                        />
                        Open for Donations
                    </label>
                </div>

                <button type="submit" className="form-button">
                    Create Fundraiser
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default FundraiserForm;