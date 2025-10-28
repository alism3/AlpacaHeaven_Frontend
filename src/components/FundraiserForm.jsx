import { useState, useEffect } from 'react';  // Add useEffect here
import { useNavigate } from 'react-router-dom';
import postFundraiser from '../api/post-fundraiser';


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


    // checks if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token, redirect to login
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
        setShowSuccessPopup(true);  // Add this line - it was missing!
    } catch (err) {
        console.error('Error creating fundraiser:', err);
        setError(err.message);
    }
};

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
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                    <h2>Fundraiser Created! 🎉</h2>
                    <p>Your fundraiser has been created successfully.</p>
                    <p>Click the X to return to homepage.</p>
                </div>
            )}

            <h2>Create a New Fundraiser</h2>
            <form onSubmit={handleSubmit} style={{
                maxWidth: '400px',
                margin: '2rem auto',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>

            
                <div style={{ marginBottom: '1rem' }}>
                    <label 
                        htmlFor="title"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={fundraiserData.title}
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
                        htmlFor="description"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={fundraiserData.description}
                        onChange={handleChange}
                        required
                        rows="4"
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
                        htmlFor="goal"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Goal Amount ($):
                    </label>
                    <input
                        type="number"
                        id="goal"
                        name="goal"
                        value={fundraiserData.goal}
                        onChange={handleChange}
                        required
                        min="0"
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
                        htmlFor="image"
                        style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Image URL:
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={fundraiserData.image}
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
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="is_open"
                            checked={fundraiserData.is_open}
                            onChange={(e) => setFundraiserData({
                                ...fundraiserData,
                                is_open: e.target.checked
                            })}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Open for Donations
                    </label>
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
                    Create Fundraiser
                </button>
            </form>
            {error && (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            )}
        </div>
    );
}

export default FundraiserForm;