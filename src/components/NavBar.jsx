import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import alpacaIcon from "../assets/alpaca.png";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setProfileMenuOpen(false);
      }
    };
    
    if (profileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileMenuOpen]);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="logo-icon">AH</span>
            <span className="logo-text">Alpaca Heaven</span>
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <button 
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Menu */}
          <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
            <Link 
              to="/" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {/* Logged In User Menu */}
                <Link 
                  to="/create-fundraiser" 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Campaign
                </Link>

                <Link 
                  to="/" 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>

                {/* Profile Dropdown - Desktop */}
                <div className="profile-dropdown desktop-only">
                  <button 
                    className="profile-toggle"
                    onClick={toggleProfileMenu}
                    aria-label="Profile menu"
                  >
                    <img 
                      src={alpacaIcon} 
                      alt="Profile" 
                      className="alpaca-icon"
                    />
                    <span className="speech-bubble">Hi {currentUser?.username}!</span>
                  </button>

                  {profileMenuOpen && (
                    <div className="profile-menu">
                      <Link 
                        to="/profile" 
                        className="profile-link"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        👤 My Profile
                      </Link>

                      <button 
                        className="profile-logout"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Menu - Mobile */}
                <div className="nav-user-menu mobile-only">
                  <Link 
                    to="/profile" 
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>

                  <button 
                    className="btn-logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Not Logged In - Show Auth Links */}
                <Link 
                  to="/" 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>

                <Link 
                  to="/login" 
                  className="nav-link nav-login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link 
                  to="/register" 
                  className="nav-link nav-register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default NavBar;