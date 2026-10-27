const dns=require("dns");
dns.setServers(["8.8.8.8","1.1.1.1"]);

const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();

const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");
const alumniRoutes=require("./routes/alumniRoutes");
const jobRoutes=require("./routes/jobRoutes");
const queryRoutes=require("./routes/queryRoutes");

const app=express();
const PORT=process.env.PORT||5000;

app.use(cors({origin:process.env.FRONTEND_URL||"http://localhost:5173"}));
app.use(express.json());

app.get("/",(req,res)=>res.json({message:"Alumni Connect Portal Backend Running"}));

app.use("/api/auth",authRoutes);
app.use("/api/alumni",alumniRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/queries",queryRoutes);

const start=async()=>{
  await connectDB();
  app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
};

start();