
import React from "react";
import {Link,useNavigate} from "react-router-dom";

export default function Navbar(){

  const nav=useNavigate();
  const token=localStorage.getItem("token");
  const user=JSON.parse(localStorage.getItem("user")||"null");

  const logout=()=>{
    localStorage.clear();
    nav("/login");
  };

  // Public navbar
  if(!token||!user){
    return(
      <nav className="navbar reference-navbar">

        <Link to="/" className="reference-brand" aria-label="Alumni Connect Portal home">

          <span className="reference-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path
                d="M5 17.5 24 8l19 9.5L24 27 5 17.5Z"
                fill="currentColor"
              />
              <path
                d="M12 22v9.2c6.8 5.4 17.2 5.4 24 0V22l-12 6-12-6Z"
                fill="currentColor"
                opacity=".92"
              />
              <path
                d="M42 19v11"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="42" cy="33" r="2.5" fill="currentColor"/>
            </svg>
          </span>

          <span className="reference-brand-copy">
            <b>Alumni Connect Portal</b>
            <small>CONNECT · COLLABORATE · GROW</small>
          </span>

        </Link>

        <div className="reference-nav-links">
          <Link to="/" className="reference-nav-login reference-nav-page">Home</Link>
          <a href="/#about" className="reference-nav-login reference-nav-page">About</a>
          <Link to="/login" className="reference-nav-login">↪ Login</Link>
          <Link to="/register" className="reference-nav-register">♙ Register</Link>
        </div>

      </nav>
    );
  }

  // Logged-in navbar
  return(
    <>

      <div className="portal-strip">

        <div className="portal-title">
          ABC Engineering College <span>•</span> MERN Stack <span>•</span> SIH 2025 Centralized Portal
        </div>

        <div className="strip-right">
          <span className="atlas-pill">
            ◉ Atlas: <b>Connected</b>
          </span>

          <span className="role-pill">
            {user?.role?.toUpperCase()}
          </span>
        </div>

      </div>

      <nav className="navbar">

        {/* Same branding as public homepage and login page */}
        <Link to="/" className="reference-brand" aria-label="Alumni Connect Portal home">

          <span className="reference-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path
                d="M5 17.5 24 8l19 9.5L24 27 5 17.5Z"
                fill="currentColor"
              />
              <path
                d="M12 22v9.2c6.8 5.4 17.2 5.4 24 0V22l-12 6-12-6Z"
                fill="currentColor"
                opacity=".92"
              />
              <path
                d="M42 19v11"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="42" cy="33" r="2.5" fill="currentColor"/>
            </svg>
          </span>

          <span className="reference-brand-copy">
            <b>Alumni Connect Portal</b>
            <small>CONNECT · COLLABORATE · GROW</small>
          </span>

        </Link>

        <div className="nav-links">

          <Link to="/">Home</Link>

          <Link to="/alumni">
            ♧&nbsp; Search Alumni
          </Link>

          <Link to="/jobs">
            ▣&nbsp; Job Opportunities
          </Link>

          {user.role==="admin"&&
            <Link to="/admin">Admin</Link>
          }

          {user.role==="alumni"&&
            <Link to="/alumni-dashboard">Dashboard</Link>
          }

          {user.role==="student"&&
            <Link to="/student-dashboard">Dashboard</Link>
          }

          <button className="nav-logout" onClick={logout}>
            Logout
          </button>

        </div>

      </nav>

    </>
  );
}
