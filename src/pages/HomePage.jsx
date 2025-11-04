import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  // Get ALL data from the hook
  const { fundraisers, isLoading, error } = useFundraisers();    

  return (
    <div className="home-page">
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/18129380/pexels-photo-18129380.png')`
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to<br />
            <span className="hero-title-accent">Alpaca Heaven</span>
          </h1>
          <p className="hero-subtitle">Where Fluff Meets Funds!</p>
          <p className="hero-description">
            Support our fuzzy alpaca friends with compassion and humor. 
            Every pledge helps create a better future for them!
          </p>
          <div className="hero-actions">
            <Link to="/create-fundraiser" className="btn btn-primary btn-rounded">
              Start a Campaign
            </Link>
            <button 
              onClick={() => {
                const campaignsSection = document.getElementById('campaigns-section');
                if (campaignsSection) {
                  campaignsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="btn btn-secondary btn-rounded"
            >
              Browse Campaigns
            </button>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS SECTION - TARGET FOR SCROLL */}
      <section id="campaigns-section" className="campaigns-container">
        <div className="campaigns-header">
          <h2>Our Campaigns</h2>
          <p>Help alpacas and amazing causes reach their dreams!</p>
        </div>

        {isLoading ? (
          <div className="loading">⏳ Loading campaigns...</div>
        ) : error ? (
          <div className="error">❌ {error}</div>
        ) : (
          <div className="fundraisers-grid">
            {fundraisers && fundraisers.length > 0 ? (
              fundraisers.map((fundraiser) => (
                <FundraiserCard key={fundraiser.id} fundraiserData={fundraiser} />
              ))
            ) : (
              <div className="no-fundraisers">
                📭 No campaigns yet. Be the first to create one!
                <Link to="/create-fundraiser" className="create-first-btn">
                  Create First Campaign
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;