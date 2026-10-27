import React,{useEffect,useMemo,useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api";

export default function AlumniDirectory(){

  const navigate=useNavigate();

  const [items,setItems]=useState([]);
  const [search,setSearch]=useState("");
  const [department,setDepartment]=useState("");
  const [year,setYear]=useState("");
  const [company,setCompany]=useState("");
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    loadAlumni();
  },[]);

  const loadAlumni=async()=>{
    try{
      const r=await api.get("/alumni");
      setItems(r.data||[]);
    }
    catch(e){
      setMsg(
        e.response?.data?.message ||
        "Unable to load alumni"
      );
    }
  };

  const departments=[
    "CSE",
    "CSM",
    "CSD",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "IT",
    "AIML",
    "MBA",
    "MCA"
  ];

  const years=Array.from(
    {length:new Date().getFullYear()-2001+1},
    (_,i)=>new Date().getFullYear()-i
  );

  const filtered=useMemo(()=>{

    const q=search.toLowerCase().trim();

    return items.filter(x=>{

      const text=[
        x.alumniName,
        x.companyName,
        x.designation,
        x.skills
      ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

      const matchesSearch=
        !q||text.includes(q);

      const matchesDepartment=
        !department||
        x.department===department;

      const matchesYear=
        !year||
        String(x.graduationYear)===String(year);

      const matchesCompany=
        !company||
        (x.companyName||"")
          .toLowerCase()
          .includes(company.toLowerCase());

      return(
        matchesSearch &&
        matchesDepartment &&
        matchesYear &&
        matchesCompany
      );
    });

  },[
    items,
    search,
    department,
    year,
    company
  ]);

  return(
    <main className="directory-page">

      <section className="directory-hero">

        <div>

          <span className="directory-badge">
            ♧ &nbsp; Centralized College Directory
          </span>

          <h1>
            Alumni Directory &amp; Search
          </h1>

          <p>
            Search verified graduates of ABC Engineering College by
            department, current organization, designation, or skillset.
          </p>

        </div>

      </section>

      <section className="directory-search">

        <div className="directory-search-grid">

          <div className="search-field">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, skill, title..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />

          </div>

          <select
            value={department}
            onChange={e=>setDepartment(e.target.value)}
          >

            <option value="">
              All Departments
            </option>

            {departments.map(d=>(
              <option
                key={d}
                value={d}
              >
                {d}
              </option>
            ))}

          </select>

          <div className="search-field">

            <span>▦</span>

            <input
              type="text"
              placeholder="Filter by company (e.g. Google)"
              value={company}
              onChange={e=>setCompany(e.target.value)}
            />

          </div>

          <select
            value={year}
            onChange={e=>setYear(e.target.value)}
          >

            <option value="">
              All Graduation Years
            </option>

            {years.map(y=>(
              <option
                key={y}
                value={y}
              >
                {y}
              </option>
            ))}

          </select>

        </div>

        <div className="directory-result">

          Found {filtered.length} registered alumni in MongoDB Atlas

        </div>

      </section>

      {msg&&(
        <div className="form-error directory-error">
          {msg}
        </div>
      )}

      <section className="alumni-results">

        {filtered.length===0 ? (

          <div className="empty-state">
            No alumni found matching your search.
          </div>

        ) : (

          <div className="alumni-grid">

            {filtered.map(x=>(

              <article
                className="alumni-card"
                key={x._id||x.alumniId}
                onClick={()=>navigate(`/alumni/${x._id||x.alumniId}`,{state:{alumni:x}})}
                style={{cursor:"pointer"}}
              >

                <div className="avatar">
                  {(x.alumniName||"A")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h3>
                    {x.alumniName}
                  </h3>

                  <p>
                    {x.designation||"Alumni"}
                  </p>

                  <p>
                    {x.companyName||
                     "Company not specified"}
                  </p>

                  <span>
                    {x.department}

                    {x.graduationYear
                      ?` • ${x.graduationYear}`
                      :""
                    }
                  </span>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}