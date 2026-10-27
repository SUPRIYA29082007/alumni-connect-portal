import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import GoogleSignIn from "../../components/GoogleSignIn";

export default function Login(){

  const nav=useNavigate();

  const [f,setF]=useState({
    email:"",
    password:""
  });

  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword]=useState(false);

  const c=e=>{
    setF({
      ...f,
      [e.target.name]:e.target.value
    });
  };

  const go=u=>{
    localStorage.setItem("token",u.token);
    localStorage.setItem("user",JSON.stringify(u.user));

    nav(
      u.user.role==="admin"
        ?"/admin"
        :u.user.role==="alumni"
        ?"/alumni-dashboard"
        :"/student-dashboard"
    );
  };

  const submit=async e=>{
    e.preventDefault();

    setErr("");
    setLoading(true);

    try{

      const r=await api.post(
        "/auth/login",
        f
      );

      go(r.data);

    }catch(x){

      setErr(
        x.response?.data?.message ||
        "Login failed"
      );

    }finally{

      setLoading(false);

    }
  };

  return(
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to ABC Engineering College Alumni Connect"
    >

      <form
        className="auth-form"
        onSubmit={submit}
      >

        {err&&(
          <div className="form-error">
            {err}
          </div>
        )}

        <label>
          Email Address *
        </label>

        <input
          type="email"
          name="email"
          value={f.email}
          onChange={c}
          required
        />

        <label>
          Password *
        </label>

        <div className="password-input-wrap">
          <input
            type={showPassword?"text":"password"}
            name="password"
            value={f.password}
            onChange={c}
            required
          />
          <button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}>
            {showPassword?"Hide":"Show"}
          </button>
        </div>

        <div className="form-row">

          <span></span>

          <Link to="/forgot-password">
            Forgot password?
          </Link>

        </div>

        <button
          className="submit-button"
          disabled={loading}
        >
          {loading
            ?"Signing in..."
            :"Sign In →"
          }
        </button>

      </form>

      {/* KEEP GOOGLE SIGN IN */}
      <GoogleSignIn
        onSuccess={go}
        onError={setErr}
      />

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/register">
          Create your account
        </Link>
      </p>

    </AuthLayout>
  );
}