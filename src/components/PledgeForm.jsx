import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postPledge from '../api/post-pledge';  // Add this import
import './PledgeForm.css';

function PledgeForm() {
    const [pledgeData, setPledgeData] = useState({
        amount: '',
        comment: '',
    });
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const { fundraiserId } = useParams();  // Add this to get fundraiser ID

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setPledgeData({
            ...pledgeData,
            [e.target.name]: e.target.value
        });
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate(`/fundraiser/${fundraiserId}`);  // Go back to fundraiser, not home
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await postPledge(pledgeData, fundraiserId);  // Updated
            console.log('Pledge created:', response);
            setShowSuccessPopup(true);
        } catch (err) {
            console.error('Error creating pledge:', err);
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
                    <h2>Thank You for Your Pledge! 💚</h2>
                    <p>Your pledge has been recorded successfully.</p>
                    <p>Click the X to return to the fundraiser.</p>
                </div>
            )}

            <h2>Make a Pledge</h2>
            <form onSubmit={handleSubmit} className="pledge-form-container">
                <div className="form-group">
                    <label htmlFor="amount" className="form-label">Pledge Amount ($):</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={pledgeData.amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="comment" className="form-label">Comment (Optional):</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={pledgeData.comment}
                        onChange={handleChange}
                        rows="4"
                        className="form-textarea"
                        placeholder="Leave a supportive comment..."
                    />
                </div>

                <button type="submit" className="form-button">Make Pledge</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default PledgeForm;