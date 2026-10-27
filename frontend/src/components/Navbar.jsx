import React from "react";
import {Link,useNavigate} from "react-router-dom";

export default function Navbar(){

  const nav=useNavigate();

  const token=localStorage.getItem("token");

  const user=JSON.parse(
    localStorage.getItem("user")||"null"
  );

  const logout=()=>{
    localStorage.clear();
    nav("/login");
  };

  return(
    <>
      <div className="portal-strip">

        <div className="portal-title">
          ABC Engineering College
          <span>•</span>
          MERN Stack
          <span>•</span>
          SIH 2025 Centralized Portal
        </div>

        <div className="strip-right">

          <span className="atlas-pill">
            ◉ Atlas:
            <b>Connected</b>
          </span>

          <span className="role-pill">
            {token&&user?.role
              ?user.role.toUpperCase()
              :"PUBLIC"}
          </span>

        </div>

      </div>


      <nav className="navbar">

        <Link to="/" className="brand">

          <span className="brand-mark">
            AC
          </span>

          <span className="brand-text">

            <b>Alumni Connect</b>

            <small>
              ABC ENGINEERING COLLEGE
            </small>

          </span>

        </Link>


        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/alumni">
            ♧&nbsp; Search Alumni
          </Link>

          <Link to="/jobs">
            ▣&nbsp; Job Opportunities
          </Link>

          {token&&user?.role==="admin"&&(
            <Link to="/admin">
              Admin
            </Link>
          )}

          {token&&user?.role==="alumni"&&(
            <Link to="/alumni-dashboard">
              Dashboard
            </Link>
          )}

          {token&&user?.role==="student"&&(
            <Link to="/student-dashboard">
              Dashboard
            </Link>
          )}

          {!token&&(
            <Link
              to="/login"
              className="nav-login"
            >
              ↪&nbsp; Login
            </Link>
          )}

          {token&&(
            <button
              className="nav-logout"
              onClick={logout}
            >
              Logout
            </button>
          )}

          {!token&&(
            <Link
              to="/register"
              className="nav-register"
            >
              ♙&nbsp; Register
            </Link>
          )}

        </div>

      </nav>
    </>
  );
}