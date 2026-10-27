import React,{useEffect,useState} from "react";
import api from "../../services/api";

export default function StudentQueries(){

  const [queries,setQueries]=useState([]);
  const [subject,setSubject]=useState("");
  const [question,setQuestion]=useState("");
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");
  const [saving,setSaving]=useState(false);

  const load=async()=>{
    try{
      const r=await api.get("/queries");
      setQueries(r.data||[]);
    }catch(x){
      setErr(x.response?.data?.message||"Unable to load queries.");
    }
  };

  useEffect(()=>{
    load();
  },[]);

  const submit=async e=>{
    e.preventDefault();
    setMsg("");
    setErr("");
    setSaving(true);

    try{
      await api.post("/queries",{subject,question});
      setSubject("");
      setQuestion("");
      setMsg("Query submitted successfully.");
      await load();
    }catch(x){
      setErr(x.response?.data?.message||"Unable to submit query.");
    }finally{
      setSaving(false);
    }
  };

  return(
    <main className="form-page">

      <div className="page-title">
        <span>STUDENT SUPPORT</span>
        <h1>Ask an Alumni</h1>
        <p>Ask questions and get career guidance from verified alumni.</p>
      </div>

      <section className="form-card">

        {msg&&<div className="success-box">✓ {msg}</div>}
        {err&&<div className="form-error">{err}</div>}

        <form className="auth-form" onSubmit={submit}>
          <label>Subject *</label>
          <input
            value={subject}
            onChange={e=>setSubject(e.target.value)}
            placeholder="Example: Career guidance"
            required
          />

          <label>Your Question *</label>
          <textarea
            value={question}
            onChange={e=>setQuestion(e.target.value)}
            placeholder="Write your question..."
            rows="6"
            required
          />

          <button className="submit-button" disabled={saving}>
            {saving?"Submitting...":"Submit Query"}
          </button>
        </form>
      </section>

      <section className="alumni-section query-section">
        <div className="section-heading">
          <div>
            <span>MY QUESTIONS</span>
            <h2>Previous Queries</h2>
          </div>
        </div>

        <div className="management-list">
          {queries.map(q=>(
            <article className="manage-card query-card-item" key={q._id}>
              <div>
                <span className="job-status">{q.status}</span>
                <h3>{q.subject}</h3>
                <p className="query-question">{q.question}</p>

                {q.reply&&(
                  <div className="success-box query-answer">
                    <strong>Alumni Reply</strong>
                    <p>{q.reply}</p>
                  </div>
                )}
              </div>
            </article>
          ))}

          {!queries.length&&(
            <div className="empty-state">You haven't submitted any queries yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
