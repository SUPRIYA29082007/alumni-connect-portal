import React from "react";
import {Link} from "react-router-dom";

export default function StudentDashboard(){

  const user=JSON.parse(localStorage.getItem("user")||"{}");

  return(
    <main className="student-dashboard">

      <section className="student-welcome">

        <div className="welcome-content">

          <span className="dashboard-badge">
            ✨ STUDENT PORTAL
          </span>

          <h1>
            Welcome, <span>{user.name||"Student"}</span>
          </h1>

          <p>
            Explore verified alumni, discover career opportunities,
            and connect with your college network.
          </p>

        </div>

        <div className="welcome-decoration">
          🎓
        </div>

      </section>
     

      <section className="dashboard-cards">

        <Link to="/alumni" className="dashboard-card alumni-card">

          <div className="dashboard-icon">
            👥
          </div>

          <div>
            <h2>Search Alumni</h2>

            <p>
              Find verified graduates using department,
              graduation year, company and skills.
            </p>

            <span className="card-link">
              Explore Alumni →
            </span>
          </div>

        </Link>


        <Link to="/jobs" className="dashboard-card jobs-card">

          <div className="dashboard-icon">
            💼
          </div>

          <div>
            <h2>Job Opportunities</h2>

            <p>
              Explore career opportunities, internships
              and referrals shared by alumni.
            </p>

            <span className="card-link">
              View Opportunities →
            </span>
          </div>

        </Link>

      </section>
       <Link to="/ask-query" className="dashboard-card">
  <span>💬</span>
  <h3>Ask an Alumni</h3>
  <p>
    Ask alumni questions about careers, jobs, internships and guidance.
  </p>
</Link>


    </main>
  );
}