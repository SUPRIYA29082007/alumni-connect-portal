import React from "react";
import {Link} from "react-router-dom";

export default function Home(){
  return(
    <main className="home-page">

      <section className="main-hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ &nbsp; SIH 2025 Centralized Engagement Platform
          </div>

          <h1>
            ABC Engineering College
          </h1>

          <h2>
            Alumni Connect Portal
          </h2>

          <p>
            Bridge the gap between college graduates and current students.
            Connect with thousands of alumni working globally in top tier
            companies for career guidance, internships, referrals, and mentoring.
          </p>

          <div className="hero-buttons">

            <Link to="/alumni" className="hero-btn alumni-btn">
              ⌕ &nbsp; Search Alumni Directory
            </Link>

            <Link to="/jobs" className="hero-btn jobs-btn">
              ▣ &nbsp; Explore Job Opportunities
            </Link>

            <Link to="/register" className="hero-btn register-btn">
              ♙ &nbsp; Join as Alumni / Student
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}