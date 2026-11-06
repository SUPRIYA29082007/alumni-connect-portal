import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return(
    <main className="home-page reference-home">
      <section className="reference-hero" id="about">
        <div className="reference-hero-copy">
          <h1>Your Alumni Network,<br/><span>Your Future</span></h1>
          <p>Stay connected with your college, explore<br className="desktop-break"/> job opportunities and grow together.</p>
          <div className="reference-hero-actions">
            <Link to="/login" className="reference-login-button">
              <span aria-hidden="true">↪</span> Login
            </Link>
            <Link to="/register" className="reference-register-button">
              <span aria-hidden="true">♙</span> Register
            </Link>
          </div>
        </div>
        <div className="reference-campus-photo" role="img" aria-label="College campus building and green grounds" />
      </section>
    </main>
  );
}
