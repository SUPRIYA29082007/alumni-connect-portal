import React from "react";
import {Link} from "react-router-dom";

export default function AlumniDashboard(){

  const user=JSON.parse(localStorage.getItem("user")||"null");
  const name=user?.name||"Alumni";

  return(
    <main className="alumni-dashboard">

      <section className="alumni-welcome">
        <div>
          <span className="alumni-badge">✨ ALUMNI PORTAL</span>

          <h1>
            Welcome back, <span>{name}</span>!
          </h1>

          <p>
            Stay connected, share opportunities and help the next generation
            of students build their careers.
          </p>
        </div>

        <div className="welcome-avatar">
          {name.charAt(0).toUpperCase()}
        </div>
      </section>


      <section className="alumni-stats">

        <div className="alumni-stat purple">
          <div className="stat-icon">👤</div>
          <div>
            <span>My Profile</span>
            <strong>Active</strong>
          </div>
        </div>

        <div className="alumni-stat blue">
          <div className="stat-icon">💼</div>
          <div>
            <span>Job Sharing</span>
            <strong>Open</strong>
          </div>
        </div>

        <div className="alumni-stat pink">
          <div className="stat-icon">🎓</div>
          <div>
            <span>Mentorship</span>
            <strong>Available</strong>
          </div>
        </div>

        <div className="alumni-stat orange">
          <div className="stat-icon">💬</div>
          <div>
            <span>Student Support</span>
            <strong>Connect</strong>
          </div>
        </div>

      </section>


      <section className="alumni-section">

        <div className="section-heading">
          <div>
            <span>ALUMNI SERVICES</span>
            <h2>What would you like to do?</h2>
          </div>
        </div>


        <div className="alumni-cards">

          <Link to="/alumni-profile" className="alumni-card profile-card">
            <div className="card-icon">👤</div>
            <div>
              <h3>My Profile</h3>
              <p>
                Manage your academic, professional and contact information.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>


          <Link to="/create-job" className="alumni-card job-card">
            <div className="card-icon">💼</div>
            <div>
              <h3>Post a Job</h3>
              <p>
                Share job and internship opportunities with students.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>


          <Link to="/jobs" className="alumni-card opportunity-card">
            <div className="card-icon">📋</div>
            <div>
              <h3>Job Opportunities</h3>
              <p>
                Explore opportunities shared by alumni across the portal.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>


          <Link to="/alumni" className="alumni-card directory-card">
            <div className="card-icon">👥</div>
            <div>
              <h3>Alumni Directory</h3>
              <p>
                Discover and connect with fellow alumni.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>


          <Link to="/student-queries" className="alumni-card query-card">
            <div className="card-icon">💬</div>
            <div>
              <h3>Student Queries</h3>
              <p>
                Support students with career advice and guidance.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>


          <Link to="/mentorship" className="alumni-card mentor-card">
            <div className="card-icon">🎓</div>
            <div>
              <h3>Mentorship</h3>
              <p>
                Share your experience and mentor current students.
              </p>
            </div>
            <span className="card-arrow">→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}