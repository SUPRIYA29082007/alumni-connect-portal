import React from "react";
import {Link} from "react-router-dom";

export default function Footer(){
  return <footer className="footer super-footer">
    <div className="footer-top">
      <div className="footer-brand footer-main-brand">
        <span className="brand-mark footer-logo">⌂</span>
        <div>
          <b>Alumni Connect</b>
          <span className="footer-college">ABC ENGINEERING COLLEGE</span>
          <p>Centralized alumni networking platform for students, verified alumni and administrators. Built for trusted college engagement.</p>
          <div className="footer-badges"><span>MERN STACK</span><span>MONGODB ATLAS</span><span>JWT SECURE</span></div>
        </div>
      </div>
      <div className="footer-column"><b>Quick Links</b><Link to="/">Home</Link><Link to="/alumni">Search Alumni</Link><Link to="/jobs">Job Opportunities</Link><Link to="/register">Register</Link></div>
      <div className="footer-column"><b>Portal Roles</b><span>Student • Explore alumni & jobs</span><span>Alumni • Profile & opportunities</span><span>Admin • Approvals & management</span><span>Verified alumni network</span></div>
      <div className="footer-column"><b>Technology</b><span>ReactJS Frontend</span><span>Node.js + Express API</span><span>MongoDB Atlas</span><span>JWT + bcrypt Authentication</span></div>
    </div>
    <div className="footer-cta"><div><strong>Build connections. Share opportunities. Grow together.</strong><small>ABC Engineering College • SIH 2025 Centralized Alumni Portal</small></div><Link to="/register">Join Alumni Connect →</Link></div>
    <div className="copyright"><span>© 2026 ABC Engineering College • Alumni Connect Portal</span><span>Secure • Centralized • Connected</span></div>
  </footer>
}
