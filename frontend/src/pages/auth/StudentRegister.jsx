import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";
import SuccessModal from "../../components/SuccessModal";
import GoogleSignIn from "../../components/GoogleSignIn";
import {DepartmentDropdown} from "../../components/Dropdowns";

export default function StudentRegister(){

  const nav=useNavigate();

  const [f,setF]=useState({
    userId:"",
    name:"",
    email:"",
    department:"",
    currentYear:"",
    password:"",
    confirmPassword:""
  });

  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirmPassword,setShowConfirmPassword]=useState(false);

  const c=e=>{
    setF({
      ...f,
      [e.target.name]:e.target.value
    });
  };

  const googleSuccess=u=>{
    localStorage.setItem("token",u.token);
    localStorage.setItem("user",JSON.stringify(u.user));
    nav("/student-dashboard");
  };

  const googleError=message=>{
    setErr(message);
  };

  const submit=async e=>{
    e.preventDefault();
    setErr("");

    if(f.password!==f.confirmPassword){
      return setErr("Passwords do not match");
    }

    setLoading(true);

    try{

      const {confirmPassword,...d}=f;

      await api.post(
        "/auth/register",
        {
          ...d,
          role:"student"
        }
      );

      setSuccess(true);

    }catch(x){

      setErr(
        x.response?.data?.message ||
        "Registration failed"
      );

    }finally{

      setLoading(false);

    }
  };

  return(
    <AuthLayout
      title="Student Registration"
      subtitle="Create your ABC Engineering College student account"
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
          Full Name *
        </label>

        <input
          name="name"
          value={f.name}
          onChange={c}
          required
        />

        <label>
          College Email *
        </label>

        <input
          type="email"
          name="email"
          value={f.email}
          onChange={c}
          required
        />

        <label>
          Student ID / Roll Number *
        </label>

        <input
          name="userId"
          value={f.userId}
          onChange={c}
          required
        />

        <label>
          Department *
        </label>

        <DepartmentDropdown
          value={f.department}
          onChange={e=>
            setF({
              ...f,
              department:e.target.value
            })
          }
        />

        <label>
          Current Year *
        </label>

        <select
          name="currentYear"
          value={f.currentYear}
          onChange={c}
          required
        >
          <option value="">
            Select Current Year
          </option>

          <option>
            1st Year
          </option>

          <option>
            2nd Year
          </option>

          <option>
            3rd Year
          </option>

          <option>
            4th Year
          </option>

        </select>

        <label>
          Password * <small>(minimum 6 characters)</small>
        </label>

        <div className="password-input-wrap">
          <input
            type={showPassword?"text":"password"}
            name="password"
            value={f.password}
            onChange={c}
            minLength="6"
            required
          />
          <button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}>
            {showPassword?"Hide":"Show"}
          </button>
        </div>

        <label>
          Confirm Password *
        </label>

        <div className="password-input-wrap">
          <input
            type={showConfirmPassword?"text":"password"}
            name="confirmPassword"
            value={f.confirmPassword}
            onChange={c}
            required
          />
          <button type="button" className="password-toggle" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword?"Hide confirm password":"Show confirm password"}>
            {showConfirmPassword?"Hide":"Show"}
          </button>
        </div>

        <button
          className="submit-button"
          disabled={loading}
        >
          {loading
            ?"Creating Account..."
            :"Register as STUDENT"
          }
        </button>

      </form>

      <GoogleSignIn
        onSuccess={googleSuccess}
        onError={googleError}
      />

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">
          Log in here
        </Link>
      </p>

      <SuccessModal
        open={success}
        title="Student Registration Successful!"
        message="Student account created successfully. You can now sign in with your new account."
        onAction={()=>nav("/login")}
      />

    </AuthLayout>
  );
}