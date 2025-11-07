import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./UserProfilePage.css";

function UserProfilePage() {
  const [userFundraisers, setUserFundraisers] = useState([]);
  const [userPledges, setUserPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("fundraisers");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      
      // Use env variable instead of hardcoded localhost
      const fundraisersResponse = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      
      if (fundraisersResponse.ok) {
        const allFundraisers = await fundraisersResponse.json();
        const myFundraisers = allFundraisers.filter(f => f.owner === parseInt(currentUser.id));
        setUserFundraisers(myFundraisers);
      }

      // Also fix pledges endpoint
      const pledgesResponse = await fetch(`${import.meta.env.VITE_API_URL}/pledges/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      
      if (pledgesResponse.ok) {
        const allPledges = await pledgesResponse.json();
        const myPledges = allPledges.filter(p => p.supporter === parseInt(currentUser.id));
        setUserPledges(myPledges);
      }

    } catch (err) {
      setError("Failed to load your data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFundraiser = async (fundraiserId) => {
    if (!window.confirm("Are you sure you want to delete this fundraiser?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (response.ok) {
        setUserFundraisers(prev => prev.filter(f => f.id !== fundraiserId));
        alert("Fundraiser deleted successfully!");
      } else {
        alert("Failed to delete fundraiser");
      }
    } catch (err) {
      alert("Error deleting fundraiser");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">⏳ Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src="https://i.pinimg.com/1200x/c8/c3/3f/c8c33f682259d086bb476293d10ef0c3.jpg" 
                alt="Profile Avatar" 
                className="avatar-image"
              />
            </div>
            <div>
              <h1>Welcome back, {currentUser.username}!</h1>
              <p className="profile-email">{currentUser.email}</p>
            </div>
          </div>
          
          <Link to="/create-fundraiser" className="create-btn">
            ➕ Create New Campaign
          </Link>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === "fundraisers" ? "active" : ""}`}
            onClick={() => setActiveTab("fundraisers")}
          >
            My Campaigns ({userFundraisers.length})
          </button>
          <button 
            className={`tab ${activeTab === "pledges" ? "active" : ""}`}
            onClick={() => setActiveTab("pledges")}
          >
            My Pledges ({userPledges.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "fundraisers" && (
          <div className="tab-content">
            {userFundraisers.length > 0 ? (
              <div className="fundraisers-grid">
                {userFundraisers.map((fundraiser) => (
                  <div key={fundraiser.id} className="fundraiser-card">
                    <div className="fundraiser-image-container">
                      <img 
                        src={fundraiser.image || "/api/placeholder/400/250"} 
                        alt={fundraiser.title}
                        className="fundraiser-card-image"
                      />
                      <div className="card-status-overlay">
                        <span className={`status-badge ${fundraiser.is_open ? 'active' : 'closed'}`}>
                          {fundraiser.is_open ? '🌟 Active' : '❌ Closed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <h3>{fundraiser.title}</h3>
                      <p className="card-description">
                        {fundraiser.description.length > 100 
                          ? `${fundraiser.description.substring(0, 100)}...` 
                          : fundraiser.description}
                      </p>
                      
                      <div className="card-stats">
                        <div className="stats-row">
                          <div className="stat-item">
                            <span className="stat-label">Goal</span>
                            <span className="stat-value">${fundraiser.goal.toLocaleString()}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Raised</span>
                            <span className="stat-value">
                              ${fundraiser.pledges?.reduce((sum, pledge) => sum + pledge.amount, 0).toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Supporters</span>
                            <span className="stat-value">{fundraiser.pledges?.length || 0}</span>
                          </div>
                        </div>
                        
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${Math.min(
                                (fundraiser.pledges?.reduce((sum, pledge) => sum + pledge.amount, 0) / fundraiser.goal) * 100, 
                                100
                              )}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <Link to={`/fundraiser/${fundraiser.id}`} className="btn btn-view">
                          View Campaign
                        </Link>
                        <Link to={`/edit-fundraiser/${fundraiser.id}`} className="btn btn-secondary">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteFundraiser(fundraiser.id)} 
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-campaigns">
                <p>🌱 You haven't created any campaigns yet!</p>
                <Link to="/create-fundraiser" className="btn btn-primary">
                  Create Your First Campaign
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "pledges" && (
          <div className="tab-content">
            {userPledges.length === 0 ? (
              <div className="empty-state">
                <p>💰 You haven't made any pledges yet</p>
                <Link to="/" className="cta-btn">
                  Browse Campaigns
                </Link>
              </div>
            ) : (
              <div className="pledges-list">
                {userPledges.map((pledge) => (
                  <div key={pledge.id} className="pledge-item">
                    <div className="pledge-amount">${pledge.amount}</div>
                    <div className="pledge-details">
                      <h4>Pledge to: {pledge.fundraiser_title || "Campaign"}</h4>
                      <p>{pledge.comment}</p>
                      <span className="pledge-date">
                        {new Date(pledge.date_created).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;