import React,{useEffect,useState} from "react";
import api from "../../services/api";

export default function AdminDashboard(){

  const [pending,setPending]=useState([]);
  const [msg,setMsg]=useState("Loading pending alumni...");

  const load=async()=>{
    try{
      const r=await api.get("/auth/pending-alumni");
      setPending(r.data);
      setMsg("");
    }catch(x){
      setMsg(
        x.response?.data?.message ||
        "Unable to load pending alumni."
      );
    }
  };

  useEffect(()=>{
    load();
  },[]);

  const approve=async id=>{
    try{
      await api.put(`/auth/approve-alumni/${id}`);
      load();
    }catch(x){
      alert(
        x.response?.data?.message ||
        "Approval failed"
      );
    }
  };

  return(
    <main className="admin-dashboard">

      <section className="admin-hero">

        <div>
          <span className="admin-eyebrow">
            ADMIN CONTROL CENTER
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Approve alumni registrations and manage
            centralized portal records.
          </p>
        </div>

        <div className="admin-icon">
          👑
        </div>

      </section>

      <section className="admin-stats">

        <div className="admin-stat-card purple">
          <div className="stat-icon">👥</div>
          <div>
            <span>Pending Alumni</span>
            <strong>{pending.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card blue">
          <div className="stat-icon">📋</div>
          <div>
            <span>Registrations</span>
            <strong>{pending.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card orange">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Needs Approval</span>
            <strong>{pending.length}</strong>
          </div>
        </div>

      </section>

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>
            <span className="panel-label">
              ALUMNI MANAGEMENT
            </span>

            <h2>
              Pending Alumni Registrations
            </h2>

            <p>
              Review and approve alumni accounts before
              they can access the portal.
            </p>
          </div>

          <div className="pending-count">
            {pending.length}
            <small>Pending</small>
          </div>

        </div>

        {msg&&(
          <div className="admin-info">
            <span>ℹ️</span>
            {msg}
          </div>
        )}

        <div className="pending-list">

          {pending.map(u=>(
            <div
              className="pending-card"
              key={u._id}
            >

              <div className="alumni-avatar">
                {u.name?.charAt(0).toUpperCase()}
              </div>

              <div className="alumni-details">

                <h3>
                  {u.name}
                </h3>

                <div className="alumni-info">

                  <span>
                    📧 {u.email}
                  </span>

                  <span>
                    🆔 {u.userId}
                  </span>

                </div>

                <span className="status-badge">
                  ● Pending Approval
                </span>

              </div>

              <button
                className="approve-button"
                onClick={()=>approve(u._id)}
              >
                ✓ Approve
              </button>

            </div>
          ))}

        </div>

        {!msg&&!pending.length&&(
          <div className="empty-admin">

            <div className="empty-icon">
              🎉
            </div>

            <h3>
              All Caught Up!
            </h3>

            <p>
              There are no pending alumni registrations
              right now.
            </p>

          </div>
        )}

      </section>

    </main>
  );
}