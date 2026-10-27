import React,{useEffect,useMemo,useState} from "react";
import api from "../services/api";

export default function Jobs(){

  const [jobs,setJobs]=useState([]);
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("");
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    loadJobs();
  },[]);

  const loadJobs=async()=>{
    try{
      const r=await api.get("/jobs");
      setJobs(r.data||[]);
    }catch(e){
      setMsg(e.response?.data?.message||"Unable to load job opportunities");
    }
  };

  const filtered=useMemo(()=>{
    const q=search.toLowerCase().trim();

    return jobs.filter(x=>{
      const text=[x.jobTitle,x.companyName,x.location,x.experienceRequired,x.status]
        .filter(Boolean).join(" ").toLowerCase();
      const matchesSearch=!q||text.includes(q);
      const matchesStatus=!status||(x.status||"Open")===status;
      return matchesSearch&&matchesStatus;
    });
  },[jobs,search,status]);

  return(
    <main className="jobs-page">

      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <span className="jobs-badge">▣ &nbsp; Campus &amp; Off-Campus Hiring Openings</span>
          <h1>College Job &amp; Internship Board</h1>
          <p>Exclusive career postings and employee referrals shared directly by verified ABC Engineering College alumni.</p>
        </div>
        <div className="jobs-hero-cta">Are you an alumnus? Log in to share job openings &amp; referrals!</div>
      </section>

      <section className="jobs-search">
        <div className="jobs-search-grid">
          <div className="search-field">
            <span>⌕</span>
            <input type="text" placeholder="Search by job title, company name, skill, or location..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All Job Types</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="jobs-result">Active Opportunities: {filtered.length} in MongoDB Atlas</div>
      </section>

      {msg&&<div className="form-error directory-error">{msg}</div>}

      <section className="jobs-results">
        {filtered.length===0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No job opportunities found</h3>
            <p>There are currently no job or internship opportunities matching your search.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filtered.map(x=>(
              <article className="job-card" key={x._id||x.jobId}>

                <div className="job-card-top">
                  <span className="job-company-icon">{(x.companyName||"C").charAt(0).toUpperCase()}</span>
                  <span className={(x.status||"Open")==="Open"?"job-status open":"job-status closed"}>{x.status||"Open"}</span>
                </div>

                <h3>{x.jobTitle}</h3>
                <p className="job-company">{x.companyName}</p>

                <div className="job-details">
                  <span>📍 {x.location||"Location not specified"}</span>
                  <span>💼 {x.experienceRequired||"Experience not specified"}</span>
                </div>

                {x.lastDate&&<div className="job-last-date"><strong>Last Date:</strong> {x.lastDate}</div>}

                {x.jobLink ? (
                  <a
                    className="job-apply-button"
                    href={x.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 Apply / View Job →
                  </a>
                ) : (
                  <div className="job-link-missing">Application link not provided</div>
                )}

              </article>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
