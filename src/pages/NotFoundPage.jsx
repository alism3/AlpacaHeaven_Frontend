import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-icon">🦙</div>
          <h1>404</h1>
          <h2>Oops! Page Not Found</h2>
          <p>
            Looks like this alpaca wandered off! The page you're looking for doesn't exist.
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn-home">
              🏠 Go Home
            </Link>
            <Link to="/create-fundraiser" className="btn-create">
              ➕ Create Campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;