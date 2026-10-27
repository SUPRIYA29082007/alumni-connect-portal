import React,{useEffect,useState} from "react";
import api from "../../services/api";

const empty={companyName:"",jobTitle:"",location:"",experienceRequired:"",lastDate:"",jobLink:"",status:"Open"};

export default function JobManager(){

  const [jobs,setJobs]=useState([]);
  const [f,setF]=useState(empty);
  const [editing,setEditing]=useState(null);
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");
  const [saving,setSaving]=useState(false);

  const load=async()=>{
    try{
      const profile=await api.get("/alumni/me");
      const r=await api.get("/jobs");
      setJobs(r.data.filter(j=>j.alumniId&&j.alumniId._id===profile.data._id));
    }catch(x){
      setErr(x.response?.data?.message||"Unable to load your jobs.");
    }
  };

  useEffect(()=>{load()},[]);

  const c=e=>setF({...f,[e.target.name]:e.target.value});

  const submit=async e=>{
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);

    try{
      if(editing){
        await api.put(`/jobs/${editing}`,f);
      }else{
        await api.post("/jobs",f);
      }

      setF(empty);
      setEditing(null);
      setMsg(editing?"Job post updated successfully.":"Job post created successfully.");
      await load();
    }catch(x){
      setErr(x.response?.data?.message||"Could not save job post");
    }finally{
      setSaving(false);
    }
  };

  const edit=j=>{
    setEditing(j._id);
    setF({
      companyName:j.companyName||"",
      jobTitle:j.jobTitle||"",
      location:j.location||"",
      experienceRequired:j.experienceRequired||"",
      lastDate:j.lastDate||"",
      jobLink:j.jobLink||"",
      status:j.status||"Open"
    });
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const remove=async id=>{
    if(!window.confirm("Delete this job post?"))return;
    try{
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j=>j._id!==id));
      setMsg("Job post deleted.");
    }catch(x){
      setErr(x.response?.data?.message||"Delete failed");
    }
  };

  return(
    <main className="management job-manager-page">

      <div className="management-head job-manager-head">
        <span className="eyebrow">ALUMNI CAREER SHARING</span>
        <h1>My Job Posts</h1>
        <p className="muted">Create, update and manage opportunities shared with students.</p>
      </div>

      <div className="manage-layout job-manager-layout">

        <section className="form-card job-form-card">

          <h2>{editing?"Edit Job Post":"Create Job Post"}</h2>

          {err&&<div className="form-error">{err}</div>}
          {msg&&<div className="success-box">✓ {msg}</div>}

          <form className="auth-form" onSubmit={submit}>

            <label>Company Name *</label>
            <input name="companyName" value={f.companyName} onChange={c} required/>

            <label>Job / Internship Title *</label>
            <input name="jobTitle" value={f.jobTitle} onChange={c} required/>

            <label>Location</label>
            <input name="location" value={f.location} onChange={c} placeholder="Hyderabad / Remote"/>

            <label>Experience Required</label>
            <input name="experienceRequired" value={f.experienceRequired} onChange={c} placeholder="0-2 years"/>

            <label>Last Date</label>
            <input name="lastDate" value={f.lastDate} onChange={c} placeholder="30-11-2026"/>

            <label>Job / Application Link *</label>
            <input
              type="url"
              name="jobLink"
              value={f.jobLink}
              onChange={c}
              placeholder="https://company.com/careers/job"
              required
            />

            <small className="job-link-help">Students will use this link to open the original job application page.</small>

            <label>Status</label>
            <select name="status" value={f.status} onChange={c}>
              <option>Open</option>
              <option>Closed</option>
            </select>

            <div className="form-actions">
              <button className="submit-button" disabled={saving}>
                {saving?"Saving...":editing?"Update Job":"Publish Job"}
              </button>

              {editing&&<button type="button" className="secondary-btn" onClick={()=>{setEditing(null);setF(empty)}}>Cancel</button>}
            </div>

          </form>
        </section>

        <section>

          <h2 className="list-heading">Published Opportunities</h2>

          <div className="management-list">

            {jobs.map(j=>(
              <article className="manage-card job-manage-card" key={j._id}>

                <div>
                  <span className="job-status">{j.status}</span>
                  <h3>{j.jobTitle}</h3>
                  <p>{j.companyName} • {j.location||"Location not specified"}</p>
                  <small>{j.experienceRequired||"Experience not specified"} • Last date: {j.lastDate||"Not specified"}</small>

                  {j.jobLink&&<div className="posted-link">🔗 {j.jobLink}</div>}
                </div>

                <div className="manage-actions">
                  <button className="secondary-btn" onClick={()=>edit(j)}>Edit</button>
                  <button className="danger-btn" onClick={()=>remove(j._id)}>Delete</button>
                </div>

              </article>
            ))}

            {!jobs.length&&<div className="empty-state">No job posts yet. Create your first opportunity.</div>}

          </div>

        </section>

      </div>

    </main>
  );
}
