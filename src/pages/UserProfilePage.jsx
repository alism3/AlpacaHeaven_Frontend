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
      
      // Fetch user's fundraisers
      const fundraisersResponse = await fetch("http://127.0.0.1:8000/api/fundraisers/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      
      if (fundraisersResponse.ok) {
        const allFundraisers = await fundraisersResponse.json();
        const myFundraisers = allFundraisers.filter(f => f.owner === currentUser.id);
        setUserFundraisers(myFundraisers);
      }

      // Fetch user's pledges
      const pledgesResponse = await fetch("http://127.0.0.1:8000/api/pledges/", {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });
      
      if (pledgesResponse.ok) {
        const allPledges = await pledgesResponse.json();
        const myPledges = allPledges.filter(p => p.supporter === currentUser.id);
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
      const response = await fetch(`http://127.0.0.1:8000/api/fundraisers/${fundraiserId}/`, {
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
            <div className="profile-avatar">🦙</div>
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
            {userFundraisers.length === 0 ? (
              <div className="empty-state">
                <p>📭 You haven't created any campaigns yet</p>
                <Link to="/create-fundraiser" className="cta-btn">
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <div className="items-grid">
                {userFundraisers.map((fundraiser) => (
                  <div key={fundraiser.id} className="fundraiser-item">
                    <div className="item-image">
                      {fundraiser.image ? (
                        <img src={fundraiser.image} alt={fundraiser.title} />
                      ) : (
                        <div className="placeholder">🦙</div>
                      )}
                    </div>
                    
                    <div className="item-content">
                      <h3>{fundraiser.title}</h3>
                      <p className="item-description">
                        {fundraiser.description.substring(0, 100)}...
                      </p>
                      
                      <div className="item-stats">
                        <span>${fundraiser.current_amount || 0} raised</span>
                        <span>Goal: ${fundraiser.target_amount}</span>
                      </div>
                      
                      <div className="item-actions">
                        <Link 
                          to={`/fundraiser/${fundraiser.id}`}
                          className="btn btn-primary"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/edit-fundraiser/${fundraiser.id}`}
                          className="btn btn-secondary"
                        >
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