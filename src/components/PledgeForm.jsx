import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postPledge from '../api/post-pledge';
import './PledgeForm.css';

function PledgeForm() {
    const [pledgeData, setPledgeData] = useState({
        amount: '',
        comment: '',
        anonymous: false,  
    });
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const { fundraiserId } = useParams();

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

    // Helper function for +/- buttons
    const adjustAmount = (change) => {
        const currentAmount = parseFloat(pledgeData.amount) || 0;
        const newAmount = Math.max(0, currentAmount + change);
        setPledgeData({
            ...pledgeData,
            amount: newAmount.toString()
        });
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate(`/fundraiser/${fundraiserId}`);
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    console.log('=== HANDLE SUBMIT DEBUG ===');
    console.log('A. Fundraiser ID from params:', fundraiserId);
    console.log('B. Pledge data state:', pledgeData);
    
    // Validate amount
    const amount = parseFloat(pledgeData.amount);
    if (!amount || amount <= 0) {
        setError('Please enter a valid amount greater than $0');
        return;
    }
    
    try {
        const response = await postPledge(pledgeData, fundraiserId);
        console.log('C. Pledge created successfully:', response);
        setShowSuccessPopup(true);
    } catch (err) {
        console.error('D. Error caught in handleSubmit:', err);
        console.error('E. Error message:', err.message);
        
        // Show the actual server error
        setError(err.message);
    }
};

    return (
        <div className="pledge-form-container">
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

            <form onSubmit={handleSubmit} className="pledge-form">
                <h2 className="pledge-title">
                    <img 
                        src="https://i.pinimg.com/736x/c2/c1/9c/c2c19cf2970f53d50f68b924774f0736.jpg" 
                        alt="Make Pledge" 
                        className="pledge-title-icon"
                    />
                    Make a Pledge
                </h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="amount" className="form-label">Pledge Amount ($):</label>
                    <div className="amount-counter-container">
                        <button 
                            type="button" 
                            className="amount-btn amount-btn-minus"
                            onClick={() => adjustAmount(-5)}
                            disabled={!pledgeData.amount || parseFloat(pledgeData.amount) <= 0}
                        >
                            <span className="btn-icon">−</span>
                            <span className="btn-text">$5</span>
                        </button>
                        
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={pledgeData.amount}
                                onChange={handleChange}
                                required
                                min="0.01"
                                step="0.01"
                                className="form-input amount-input"
                                placeholder="0.00"
                            />
                        </div>
                        
                        <button 
                            type="button" 
                            className="amount-btn amount-btn-plus"
                            onClick={() => adjustAmount(5)}
                        >
                            <span className="btn-icon">+</span>
                            <span className="btn-text">$5</span>
                        </button>
                    </div>
                    <p className="amount-helper-text">💡 Use +/- buttons to quickly add/subtract $5, or type any amount!</p>
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
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="anonymous"
                            checked={pledgeData.anonymous}
                            onChange={(e) => setPledgeData({
                                ...pledgeData,
                                anonymous: e.target.checked
                            })}
                        />
                        Make this pledge anonymous
                    </label>
                </div>

                <button type="submit" className="form-button">Make Pledge</button>
            </form>
        </div>
    );
}

export default PledgeForm;