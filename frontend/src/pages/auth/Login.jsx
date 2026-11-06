
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

  const [role,setRole]=useState("student");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword]=useState(false);

  const styles={
    roleSelection:{
      marginBottom:"22px"
    },
    roleLabel:{
      fontSize:"14px",
      fontWeight:"600",
      marginBottom:"10px",
      color:"#243b63"
    },
    roleTabs:{
      display:"flex",
      gap:"8px",
      width:"100%"
    },
    roleTab:{
      flex:1,
      padding:"11px 6px",
      border:"1px solid #d5dfed",
      borderRadius:"8px",
      background:"#ffffff",
      color:"#29466f",
      fontSize:"13px",
      fontWeight:"600",
      cursor:"pointer"
    },
    activeTab:{
      background:"#2869d8",
      border:"1px solid #2869d8",
      color:"#ffffff",
      boxShadow:"0 3px 9px rgba(40,105,216,0.2)"
    }
  };

  const c=e=>{
    setF({
      ...f,
      [e.target.name]:e.target.value
    });
  };

  const go=u=>{

    if(u.user.role!==role){
      setErr(
        `This account is not registered as ${role}. Please select the correct role.`
      );
      return;
    }

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

      <div style={styles.roleSelection}>

        <p style={styles.roleLabel}>
          Select Your Role
        </p>

        <div style={styles.roleTabs}>

          {["student","alumni","admin"].map(item=>(
            <button
              key={item}
              type="button"
              onClick={()=>{
                setRole(item);
                setErr("");
              }}
              style={{
                ...styles.roleTab,
                ...(role===item?styles.activeTab:{})
              }}
            >
              {item==="student"?"🎓 Student":
               item==="alumni"?"👥 Alumni":
               "🛡️ Admin"}
            </button>
          ))}

        </div>

      </div>

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

          <button
            type="button"
            className="password-toggle"
            onClick={()=>setShowPassword(!showPassword)}
            aria-label={showPassword?"Hide password":"Show password"}
          >
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
          {loading?"Signing in...":"Sign In →"}
        </button>

      </form>

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
