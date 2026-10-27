const jwt=require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{try{const header=req.headers.authorization;if(!header||!header.startsWith("Bearer "))return res.status(401).json({message:"Authentication required"});const token=header.split(" ")[1];req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch(e){return res.status(401).json({message:"Invalid or expired token"})}};
const authorizeRoles=(...roles)=>(req,res,next)=>{if(!roles.includes(req.user.role))return res.status(403).json({message:"Access denied"});next()};
module.exports={authMiddleware,authorizeRoles};