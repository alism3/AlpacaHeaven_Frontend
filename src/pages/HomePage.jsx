import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  const { fundraisers } = useFundraisers();    

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
            <Link to="/make-pledge" className="btn btn-primary btn-rounded">
              Make a Pledge
            </Link>
            <Link to="/create-fundraiser" className="btn btn-secondary btn-rounded">
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* FUNDRAISERS SECTION */}
      <section className="section section-light" id="fundraisers">
        <div className="container">
          <h2>Active Fundraisers</h2>
          <div className="fundraiser-list">
            {fundraisers && fundraisers.length > 0 ? (
              fundraisers.map((fundraiserData, key) => {
                return <FundraiserCard key={key} fundraiserData={fundraiserData} />;
              })
            ) : (
              <p className="no-fundraisers">
                No fundraisers yet. Be the first to create one! 🎉
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;