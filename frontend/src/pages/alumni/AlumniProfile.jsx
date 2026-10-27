import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import api from "../../services/api";
import {DepartmentDropdown,YearDropdown} from "../../components/Dropdowns";

export default function AlumniProfile(){
  const [f,setF]=useState({alumniName:"",rollNumber:"",graduationYear:"",department:"",companyName:"",designation:"",email:"",mobile:"",skills:"",bio:""});
  const [id,setId]=useState(null); const [msg,setMsg]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
  useEffect(()=>{api.get("/alumni/me").then(r=>{setId(r.data._id);setF({...r.data,graduationYear:String(r.data.graduationYear||"")})}).catch(x=>{if(x.response?.status!==404)setErr(x.response?.data?.message||"Unable to load profile")}).finally(()=>setLoading(false))},[]);
  const c=e=>setF({...f,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setMsg("");setErr("");setSaving(true);try{const payload={...f,graduationYear:Number(f.graduationYear)};const r=id?await api.put(`/alumni/${id}`,payload):await api.post("/alumni",payload);setId(r.data._id);setF({...r.data,graduationYear:String(r.data.graduationYear||"")});setMsg("Profile saved successfully.")}catch(x){setErr(x.response?.data?.message||"Could not save profile")}finally{setSaving(false)}};
  if(loading)return <main className="dashboard"><div className="info-box">Loading your alumni profile from MongoDB Atlas...</div></main>;
  return <main className="form-page"><div className="page-title"><span>ALUMNI PROFILE MANAGEMENT</span><h1>My Alumni Profile</h1><p>Keep your academic and professional details updated for the verified alumni directory.</p></div><section className="form-card wide"><form className="auth-form form-grid" onSubmit={submit}>{err&&<div className="form-error field-full">{err}</div>}{msg&&<div className="success-box field-full">✓ {msg}</div>}
    <div className="field"><label>Full Name *</label><input name="alumniName" value={f.alumniName} onChange={c} required/></div>
    <div className="field"><label>College Roll Number *</label><input name="rollNumber" value={f.rollNumber} onChange={c} required/></div>
    <div className="field"><label>Graduation Year *</label><YearDropdown value={f.graduationYear} onChange={e=>setF({...f,graduationYear:e.target.value})}/></div>
    <div className="field"><label>Department *</label><DepartmentDropdown value={f.department} onChange={e=>setF({...f,department:e.target.value})}/></div>
    <div className="field"><label>Email *</label><input type="email" name="email" value={f.email} onChange={c} required/></div>
    <div className="field"><label>Mobile</label><input name="mobile" value={f.mobile} onChange={c}/></div>
    <div className="field"><label>Current Company</label><input name="companyName" value={f.companyName} onChange={c}/></div>
    <div className="field"><label>Designation</label><input name="designation" value={f.designation} onChange={c}/></div>
    <div className="field field-full"><label>Skills & Expertise</label><input name="skills" value={f.skills} onChange={c} placeholder="Java, Python, React, AI"/></div>
    <div className="field field-full"><label>Bio / Mentorship</label><textarea name="bio" value={f.bio} onChange={c} rows="5" placeholder="Tell students about your career and how you can guide them."/></div>
    <div className="form-actions field-full"><button className="submit-button" disabled={saving}>{saving?"Saving...":"Save Profile"}</button><Link className="secondary-btn" to="/alumni-dashboard">Back to Dashboard</Link></div>
  </form></section></main>
}
