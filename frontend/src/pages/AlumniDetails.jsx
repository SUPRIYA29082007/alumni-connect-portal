import React,{useEffect,useState} from "react";
import {useLocation,useParams,useNavigate} from "react-router-dom";
import api from "../services/api";

export default function AlumniDetails(){

  const {id}=useParams();
  const location=useLocation();
  const navigate=useNavigate();

  const [alumni,setAlumni]=useState(location.state?.alumni||null);
  const [loading,setLoading]=useState(!location.state?.alumni);
  const [error,setError]=useState("");

  useEffect(()=>{

    if(alumni){
      return;
    }

    const load=async()=>{
      try{

        const r=await api.get("/alumni");

        const found=(r.data||[]).find(
          x=>String(x._id||x.alumniId)===String(id)
        );

        if(!found){
          setError("Alumni profile not found.");
        }else{
          setAlumni(found);
        }

      }catch(e){

        setError(
          e.response?.data?.message||
          "Unable to load alumni profile."
        );

      }finally{

        setLoading(false);

      }
    };

    load();

  },[id,alumni]);

  if(loading){

    return(
      <main className="alumni-dashboard">

        <div className="empty-state">
          Loading alumni profile...
        </div>

      </main>
    );

  }

  if(error||!alumni){

    return(
      <main className="alumni-dashboard">

        <div className="empty-state">

          <div className="empty-icon">
            👤
          </div>

          <h3>
            Alumni Not Found
          </h3>

          <p>
            {error||"This alumni profile is not available."}
          </p>

          <button
            className="submit-button"
            onClick={()=>navigate("/alumni")}
          >
            ← Back to Alumni Directory
          </button>

        </div>

      </main>
    );

  }

  return(
    <main className="alumni-dashboard">

      <section className="alumni-welcome">

        <div>

          <span className="alumni-badge">
            ✨ VERIFIED ALUMNI PROFILE
          </span>

          <h1>
            {alumni.alumniName}
          </h1>

          <p>
            {alumni.designation||"Alumni"}

            {alumni.companyName
              ?` • ${alumni.companyName}`
              :""
            }
          </p>

        </div>

        <div className="welcome-avatar">

          {(alumni.alumniName||"A")
            .charAt(0)
            .toUpperCase()}

        </div>

      </section>

      <section className="alumni-section">

        <div className="section-heading">

          <div>

            <span>
              ALUMNI INFORMATION
            </span>

            <h2>
              Profile Details
            </h2>

          </div>

        </div>

        <div className="alumni-cards">

          <div className="alumni-card profile-card">

            <div className="card-icon">
              🎓
            </div>

            <div>

              <h3>
                Education
              </h3>

              <p>
                Department:{" "}
                {alumni.department||"Not specified"}
              </p>

              <p>
                Graduation Year:{" "}
                {alumni.graduationYear||"Not specified"}
              </p>

              <p>
                Roll Number:{" "}
                {alumni.rollNumber||"Not specified"}
              </p>

            </div>

          </div>

          <div className="alumni-card job-card">

            <div className="card-icon">
              💼
            </div>

            <div>

              <h3>
                Professional Details
              </h3>

              <p>
                Company:{" "}
                {alumni.companyName||"Not specified"}
              </p>

              <p>
                Designation:{" "}
                {alumni.designation||"Not specified"}
              </p>

            </div>

          </div>

          <div className="alumni-card opportunity-card">

            <div className="card-icon">
              🛠️
            </div>

            <div>

              <h3>
                Skills
              </h3>

              <p>
                {alumni.skills||"No skills added yet."}
              </p>

            </div>

          </div>

          <div className="alumni-card directory-card">

            <div className="card-icon">
              📧
            </div>

            <div>

              <h3>
                Contact
              </h3>

              <p>
                Email:{" "}
                {alumni.email||"Not specified"}
              </p>

              <p>
                Mobile:{" "}
                {alumni.mobile||"Not specified"}
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="alumni-section">

        <div className="section-heading">

          <div>

            <span>
              ABOUT
            </span>

            <h2>
              About {alumni.alumniName}
            </h2>

          </div>

        </div>

        <div className="form-card">

          <p>
            {alumni.bio||
              "No bio has been added by this alumni yet."
            }
          </p>

        </div>

      </section>

      <section className="alumni-section">

        <button
          className="submit-button"
          onClick={()=>navigate("/alumni")}
        >
          ← Back to Alumni Directory
        </button>

      </section>

    </main>
  );
}