const express=require("express");
const r=express.Router();

const c=require("../controllers/queryController");
const {authMiddleware,authorizeRoles}=require("../middleware/authMiddleware");

r.post("/",authMiddleware,authorizeRoles("student"),c.createQuery);

r.get("/",authMiddleware,c.getQueries);

r.put("/:id/reply",authMiddleware,authorizeRoles("alumni"),c.replyQuery);

module.exports=r;