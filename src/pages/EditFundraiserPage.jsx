import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFundraiserPage.css";

function EditFundraiserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_amount: "",
    image: "",
    is_open: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchFundraiser();
  }, [id]);

  const fetchFundraiser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/${id}/`);
      
      if (!response.ok) {
        throw new Error("Fundraiser not found");
      }
      
      const data = await response.json();
      
      // Check if user owns this fundraiser
      if (data.owner !== currentUser.id) {
        setError("You don't have permission to edit this fundraiser");
        return;
      }
      
      setFormData({
        title: data.title,
        description: data.description,
        target_amount: data.goal || data.target_amount,
        image: data.image || "",
        is_open: data.is_open,
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in to edit fundraisers");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fundraisers/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          goal: formData.target_amount // Map target_amount to goal for API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update fundraiser");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/fundraiser/${id}`);
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="edit-fundraiser-page">
        <div className="loading">⏳ Loading fundraiser...</div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="edit-fundraiser-page">
        <div className="error-state">
          <h2>❌ {error}</h2>
          <button onClick={() => navigate("/profile")} className="back-btn">
            ← Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-fundraiser-page">
      <div className="edit-container">
        <div className="edit-header">
          <h1>✏️ Edit Campaign</h1>
          <button onClick={() => navigate("/profile")} className="back-btn">
            ← Back to Profile
          </button>
        </div>

        {success && (
          <div className="success-message">
            ✅ Campaign updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows={6}
              required
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_amount" className="form-label">
              Target Amount ($) *
            </label>
            <input
              type="number"
              id="target_amount"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleInputChange}
              className="form-input"
              required
              min="1"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Campaign Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com/your-awesome-image.jpg"
            />
            {formData.image && (
              <div className="image-preview-enhanced">
                <div className="preview-header">
                  <span className="preview-label">✨ Image Preview</span>
                  <span className="preview-status" id="image-status">Loading...</span>
                </div>
                <div className="preview-container">
                  <img 
                    key={formData.image}
                    src={formData.image}
                    alt="Campaign Preview" 
                    className="preview-image"
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', formData.image);
                      const statusElement = document.getElementById('image-status');
                      if (statusElement) {
                        statusElement.textContent = '✅ Image updated successfully!';
                        statusElement.className = 'preview-status success';
                      }
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', formData.image);
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
                checked={formData.is_open}
                onChange={handleInputChange}
              />
              Campaign is accepting new pledges
            </label>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              💾 Update Campaign
            </button>
            <button 
              type="button" 
              onClick={() => navigate(`/fundraiser/${id}`)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFundraiserPage;