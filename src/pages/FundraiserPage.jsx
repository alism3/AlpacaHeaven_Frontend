import { useParams, Link, useNavigate } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import "./FundraiserPage.css";
import alpacaIcon from "../assets/alpaca.png";


function FundraiserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fundraiser, isLoading, error } = useFundraiser(id);
    
        // Add this function to handle pledge button click
    const handlePledgeClick = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If not logged in, go to login page
            navigate('/login', { 
                state: { 
                    returnTo: `/fundraiser/${id}/pledge`,
                    message: 'Please log in to make a pledge' 
                } 
            });
        } else {
            // If logged in, go directly to pledge form
            navigate(`/fundraiser/${id}/pledge`);
        }
    };

    if (isLoading) {
        return (
            <div className="fundraiser-loading">
                <div className="loading-spinner">🦙</div>
                <p>Loading your alpaca adventure...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fundraiser-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error.message}</p>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    // Calculate stats
    const totalRaised = fundraiser.pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
    const supporterCount = fundraiser.pledges.length;
    
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
    };

    return (
        <div className="fundraiser-page">
            <div className="fundraiser-hero">
                <div className="fundraiser-container">
                    {/* Left Side - Image */}
                    <div className="fundraiser-image-section">
                        <div className="image-container">
                            <img 
                                src={fundraiser.image || "/api/placeholder/600/500"} 
                                alt={fundraiser.title}
                                className="fundraiser-main-image"
                            />
                            <div className="image-overlay">
                                <span className={`status-badge ${fundraiser.is_open ? 'active' : 'closed'}`}>
                                    {fundraiser.is_open ? '🌟 Active Campaign' : '❌ Campaign Ended'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="fundraiser-details-section">
                        <h1 className="fundraiser-title">{fundraiser.title}</h1>
                        
                        {/* Meta Information */}
                        <div className="fundraiser-meta">
                            <div className="creator-info">
                                <span className="label">Created by</span>
                                <div className="creator-display">
                                    <img 
                                        src={alpacaIcon} 
                                        alt=""  
                                        className="creator-lama-icon"
                                        onLoad={(e) => {
                                            console.log('✅ Image loaded successfully!');
                                        }}
                                        onError={(e) => {
                                            console.log('❌ Image failed to load, showing emoji fallback');
                                            e.target.style.display = 'none';
                                            const emoji = document.createElement('span');
                                            emoji.className = 'creator-lama-emoji';
                                            emoji.textContent = '🦙';
                                            e.target.parentNode.insertBefore(emoji, e.target);
                                        }}
                                    />
                                    <span className="creator-name">
                                        {fundraiser.owner_name || `Alpaca Lover #${fundraiser.owner}` || 'Anonymous Alpaca Enthusiast'}
                                    </span>
                                </div>
                            </div>
                            <div className="date-info">
                                <span className="label">Started on</span>
                                <span className="date">{formatDate(fundraiser.date_created)}</span>
                            </div>
                        </div>
                        {/* Progress Section */}
                        <div className="progress-section">
                            <div className="progress-stats">
                                <div className="stat-item">
                                    <span className="amount">${totalRaised.toLocaleString()}</span>
                                    <span className="label">Raised</span>
                                </div>
                                <div className="stat-item">
                                    <span className="amount">{supporterCount}</span>
                                    <span className="label">Supporters</span>
                                </div>
                            </div>
                            
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${Math.min((totalRaised / 10000) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="description-section">
                            <h3>About This Campaign</h3>
                            <p className="description-text">
                                {fundraiser.description || 
                                 `Welcome to ${fundraiser.title}! This amazing campaign is bringing alpaca dreams to life. Join our community of supporters and help make something wonderful happen. Every contribution makes a difference in achieving our shared goals! 🦙✨`}
                            </p>
                        </div>

                        {/* Call to Action */}
    <div className="cta-section">
        {fundraiser.is_open ? (
            <>
                <button 
                    className="pledge-btn primary"
                    onClick={handlePledgeClick} // Add this onClick handler
                >
                    Make a Pledge
                </button>
                <button className="share-btn secondary">
                    Share Campaign
                </button>
            </>
        ) : (
            <button className="pledge-btn" disabled style={{opacity: 0.6}}>
                Campaign Ended
            </button>
        )}
    </div>

                    </div>
                </div>
            </div>

            {/* Supporters Section */}
            <div className="supporters-section">
                <div className="supporters-container"> 
                    <h2 className="supporters-title">
                        Amazing Supporters ({supporterCount})
                    </h2>
                    
                    {fundraiser.pledges.length > 0 ? (
                        <div className="pledges-grid">
                            {fundraiser.pledges.map((pledge, index) => (
                                <div key={index} className="pledge-card">
                                    <div className="pledge-info">
                                        <span className="pledge-supporter">{pledge.supporter}</span>
                                        <span className="pledge-amount">${pledge.amount}</span>
                                        <p className="pledge-comment">
                                            "Supporting amazing alpaca projects! 🌟"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-pledges">
                            <p>🌱 Be the first to support this amazing campaign!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FundraiserPage;