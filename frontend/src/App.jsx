import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentRegister from "./pages/auth/StudentRegister";
import AlumniRegister from "./pages/auth/AlumniRegister";
import AdminRegister from "./pages/auth/AdminRegister";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AlumniDirectory from "./pages/AlumniDirectory";
import AlumniDetails from "./pages/AlumniDetails";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import StudentQueryPage from "./pages/student/StudentQueries";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniProfile from "./pages/alumni/AlumniProfile";
import JobManager from "./pages/alumni/JobManager";
import StudentQueries from "./pages/alumni/StudentQueries";
import Mentorship from "./pages/alumni/Mentorship";

function Layout({children}){
  return(
    <>
      <Navbar/>
      {children}
      <Footer/>
    </>
  );
}

function Protected({role,children}){
  const t=localStorage.getItem("token");
  const u=JSON.parse(localStorage.getItem("user")||"null");

  if(!t||!u){
    return <Navigate to="/login" replace/>;
  }

  if(role&&u.role!==role){
    return <Navigate to="/" replace/>;
  }

  return children;
}

export default function App(){
  return(
    <Routes>

      <Route path="/" element={<Layout><Home/></Layout>} />

      <Route path="/login" element={<Layout><Login/></Layout>} />

      <Route path="/register" element={<Layout><Register/></Layout>} />

      <Route path="/register/student" element={<Layout><StudentRegister/></Layout>} />

      <Route path="/register/alumni" element={<Layout><AlumniRegister/></Layout>} />

      <Route path="/register/admin" element={<Layout><AdminRegister/></Layout>} />

      <Route path="/forgot-password" element={<Layout><ForgotPassword/></Layout>} />

      <Route path="/reset-password" element={<Layout><ResetPassword/></Layout>} />

      <Route path="/alumni" element={<Layout><AlumniDirectory/></Layout>} />

      <Route
        path="/alumni/:id"
        element={
          <Layout>
            <AlumniDetails/>
          </Layout>
        }
      />

      <Route path="/jobs" element={<Layout><Jobs/></Layout>} />

      <Route
        path="/student-dashboard"
        element={
          <Protected role="student">
            <Layout>
              <Dashboard role="student"/>
            </Layout>
          </Protected>
        }
      />

      <Route
        path="/ask-query"
        element={
          <Protected role="student">
            <Layout>
              <StudentQueryPage/>
            </Layout>
          </Protected>
        }
      />
        <Route 
  path="/student-queries" 
  element={ 
    <Protected role="alumni"> 
      <Layout> 
        <StudentQueries/> 
      </Layout> 
    </Protected> 
  } 
/>
     
   <Route 
  path="/alumni-dashboard" 
  element={ 
    <Protected role="alumni"> 
      <Layout> 
        <AlumniDashboard/> 
      </Layout> 
    </Protected> 
  } 
/>

      <Route
        path="/admin"
        element={
          <Protected role="admin">
            <Layout>
              <AdminDashboard/>
            </Layout>
          </Protected>
        }
      />

      <Route
        path="/alumni-profile"
        element={
          <Protected role="alumni">
            <Layout>
              <AlumniProfile/>
            </Layout>
          </Protected>
        }
      />
    

<Route 
  path="/mentorship" 
  element={ 
    <Protected role="alumni"> 
      <Layout> 
        <Mentorship/> 
      </Layout> 
    </Protected> 
  } 
/>

      <Route
        path="/create-job"
        element={
          <Protected role="alumni">
            <Layout>
              <JobManager/>
            </Layout>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace/>} />

    </Routes>
  );
}