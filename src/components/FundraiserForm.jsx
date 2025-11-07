import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postFundraiser from '../api/post-fundraiser';
import './FundraiserForm.css';

function FundraiserForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    
    const [fundraiserData, setFundraiserData] = useState({
        title: '',
        description: '',
        goal: '',
        image: '',
        is_open: true,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchFundraiserData();
        }
    }, [id, isEditing]);

    const fetchFundraiserData = async () => {
        try {
            setIsLoadingData(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('📝 Loaded fundraiser data for editing:', data);
                
                setFundraiserData({
                    title: data.title || '',
                    description: data.description || '',
                    goal: data.goal || '',
                    image: data.image || '',
                    is_open: data.is_open ?? true,
                });
            } else {
                setError('Failed to load fundraiser data');
            }
        } catch (err) {
            console.error('Error loading fundraiser:', err);
            setError('Error loading fundraiser');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFundraiserData({
            ...fundraiserData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Helper function for +/- buttons on goal amount
    const adjustGoal = (change) => {
        const currentGoal = parseFloat(fundraiserData.goal) || 0;
        const newGoal = Math.max(0, currentGoal + change);
        setFundraiserData({
            ...fundraiserData,
            goal: newGoal.toString()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log('🔍 DEBUGGING IMAGE UPDATE:');
        console.log('1. Current form data:', fundraiserData);
        console.log('2. Image URL being sent:', fundraiserData.image);

        try {
            if (isEditing) {
                console.log('🔄 Updating fundraiser ID:', id);
                
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                    body: JSON.stringify(fundraiserData),
                });

                console.log('3. Response status:', response.status);
                
                if (response.ok) {
                    const updatedData = await response.json();
                    console.log('✅ Server returned updated data:', updatedData);
                    console.log('4. Updated image URL from server:', updatedData.image);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                    navigate('/profile');
                } else {
                    const errorData = await response.json();
                    console.error('❌ Update failed:', errorData);
                    setError(`Failed to update: ${JSON.stringify(errorData)}`);
                }
            } else {
                console.log('➕ Creating new fundraiser with data:', fundraiserData);
                await postFundraiser(fundraiserData);
                navigate('/profile');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="fundraiser-form-container">
                <div className="loading-state">
                    <div className="loading-spinner">🦙</div>
                    <p>Loading campaign data for editing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fundraiser-form-container">
            <form className="fundraiser-form" onSubmit={handleSubmit}>
                <h2 className="fundraiser-title">
                    <img 
                        src="https://i.pinimg.com/736x/d8/a1/5a/d8a15ad6796f3c531d33f56b5db589df.jpg" 
                        alt="Create Campaign" 
                        className="fundraiser-title-icon"
                    />
                    {isEditing ? 'Edit Your Campaign' : 'Create a New Campaign'}
                </h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Campaign Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={fundraiserData.title}
                        onChange={handleChange}
                        placeholder="Give your campaign a catchy title..."
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={fundraiserData.description}
                        onChange={handleChange}
                        placeholder="Tell people about your amazing campaign..."
                        rows="6"
                        required
                        className="form-textarea"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="goal" className="form-label">Funding Goal ($)</label>
                    <div className="amount-counter-container">
                        <button 
                            type="button" 
                            className="amount-btn amount-btn-minus"
                            onClick={() => adjustGoal(-100)}
                            disabled={!fundraiserData.goal || parseFloat(fundraiserData.goal) <= 0}
                        >
                            <span className="btn-icon">−</span>
                            <span className="btn-text">$100</span>
                        </button>
                        
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                id="goal"
                                name="goal"
                                value={fundraiserData.goal}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="1"
                                required
                                className="form-input amount-input"
                            />
                        </div>
                        
                        <button 
                            type="button" 
                            className="amount-btn amount-btn-plus"
                            onClick={() => adjustGoal(100)}
                        >
                            <span className="btn-icon">+</span>
                            <span className="btn-text">$100</span>
                        </button>
                    </div>
                    <p className="amount-helper-text">💡 Use +/- buttons to quickly add/subtract $100, or type any amount!</p>
                </div>

                <div className="form-group">
                    <label htmlFor="image" className="form-label">Campaign Image URL</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={fundraiserData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/your-awesome-image.jpg"
                        className="form-input"
                    />
                    {fundraiserData.image && (
                        <div className="image-preview-enhanced">
                            <div className="preview-header">
                                <span className="preview-label">✨ Image Preview</span>
                                <span className="preview-status" id="image-status">Loading...</span>
                            </div>
                            <div className="preview-container">
                                <img 
                                    key={fundraiserData.image}
                                    src={fundraiserData.image}
                                    alt="Campaign Preview" 
                                    className="preview-image"
                                    onLoad={(e) => {
                                        console.log('✅ Image loaded successfully:', fundraiserData.image);
                                        const statusElement = document.getElementById('image-status');
                                        if (statusElement) {
                                            statusElement.textContent = '✅ Image loaded successfully!';
                                            statusElement.className = 'preview-status success';
                                        }
                                    }}
                                    onError={(e) => {
                                        console.log('❌ Image failed to load:', fundraiserData.image);
                                        const statusElement = document.getElementById('image-status');
                                        if (statusElement) {
                                            statusElement.textContent = '❌ Failed to load image';
                                            statusElement.className = 'preview-status error';
                                        }
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="preview-error" style={{ display: 'none' }}>
                                    <div className="error-icon">📷</div>
                                    <p>Image could not be loaded</p>
                                    <small>Please check the URL and try again</small>
                                </div>
                            </div>
                            <div className="preview-info">
                                <small>This is how your campaign image will appear to supporters</small>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="is_open"
                            checked={fundraiserData.is_open}
                            onChange={handleChange}
                        />
                        Campaign is active and accepting pledges
                    </label>
                </div>

                <div className="form-buttons">
                    <button 
                        type="submit" 
                        className="primary-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : (isEditing ? '💾 Update Campaign' : '🚀 Create Campaign')}
                    </button>
                    
                    <button 
                        type="button" 
                        className="cancel-link"
                        onClick={() => navigate('/profile')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FundraiserForm;