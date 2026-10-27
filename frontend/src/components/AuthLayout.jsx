import React from "react";
import {Link} from "react-router-dom";

export default function AuthLayout({title,subtitle,children}){

  return(
    <main className="auth-page">

      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <section className="auth-card">

        <Link to="/" className="auth-logo">
          AC
        </Link>

        <h1>{title}</h1>

        <p className="auth-subtitle">
          {subtitle}
        </p>

        {children}

      </section>

    </main>
  );
}