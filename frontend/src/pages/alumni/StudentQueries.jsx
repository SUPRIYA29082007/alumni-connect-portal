import React,{useEffect,useState} from "react";
import api from "../../services/api";

export default function StudentQueries(){

  const [queries,setQueries]=useState([]);
  const [reply,setReply]=useState({});
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState({});

  const load=async()=>{
    try{
      const r=await api.get("/queries");
      setQueries(r.data||[]);
      setErr("");
    }catch(x){
      setErr(x.response?.data?.message||"Unable to load student queries.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    load();
  },[]);

  const sendReply=async id=>{
    const value=reply[id]?.trim();
    if(!value){
      setErr("Please write an answer before sending.");
      return;
    }

    setMsg("");
    setErr("");
    setSending({...sending,[id]:true});

    try{
      await api.put(`/queries/${id}/reply`,{reply:value});
      setReply({...reply,[id]:""});
      setMsg("Answer sent successfully.");
      await load();
    }catch(x){
      setErr(x.response?.data?.message||"Unable to send answer.");
    }finally{
      setSending({...sending,[id]:false});
    }
  };

  return(
    <main className="alumni-dashboard">

      <section className="alumni-section query-section">
        <div className="section-heading">
          <div>
            <span>STUDENT SUPPORT</span>
            <h2>Student Queries</h2>
          </div>
        </div>

        {msg&&<div className="success-box">✓ {msg}</div>}
        {err&&<div className="form-error">{err}</div>}

        {loading&&<div className="empty-state">Loading student queries...</div>}

        {!loading&&queries.length===0&&(
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No Student Queries</h3>
            <p>Student questions will appear here when they submit a query.</p>
          </div>
        )}

        <div className="management-list">
          {queries.map(q=>(
            <article className="manage-card query-card-item" key={q._id}>
              <div className="query-card-content">
                <span className={`job-status ${q.status==="Answered"?"open":""}`}>
                  {q.status}
                </span>

                <h3>{q.subject}</h3>

                <div className="query-student">
                  <p>👤 {q.studentName}</p>
                  <p>📧 {q.studentEmail}</p>
                </div>

                <div className="query-question-box">
                  <span>STUDENT QUESTION</span>
                  <p>{q.question}</p>
                </div>

                {q.reply&&(
                  <div className="success-box query-answer">
                    <strong>✓ Your Answer</strong>
                    <p>{q.reply}</p>
                  </div>
                )}

                {q.status==="Pending"&&(
                  <div className="query-reply-box">
                    <label>Your Answer</label>
                    <textarea
                      value={reply[q._id]||""}
                      onChange={e=>setReply({...reply,[q._id]:e.target.value})}
                      placeholder="Write your answer to the student..."
                      rows="5"
                    />
                    <button
                      className="submit-button"
                      onClick={()=>sendReply(q._id)}
                      disabled={sending[q._id]}
                    >
                      {sending[q._id]?"Sending...":"Send Answer"}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
