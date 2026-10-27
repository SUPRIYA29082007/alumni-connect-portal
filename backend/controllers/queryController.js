const Query=require("../models/Query");
const Users=require("../models/Users");

const createQuery=async(req,res)=>{
  try{
    const user=await Users.findById(req.user.id);

    if(!user||user.role!=="student"){
      return res.status(403).json({message:"Only students can submit queries"});
    }

    const query=new Query({
      queryId:"QRY"+Date.now(),
      studentId:user._id,
      studentName:user.name,
      studentEmail:user.email,
      subject:req.body.subject,
      question:req.body.question
    });

    await query.save();

    res.status(201).json({
      message:"Query submitted successfully",
      query
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }
};


const getQueries=async(req,res)=>{
  try{
    const user=await Users.findById(req.user.id);

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    let queries;

    if(user.role==="student"){
      queries=await Query.find({studentId:user._id}).sort({createdAt:-1});
    }else if(user.role==="alumni"){
      queries=await Query.find().sort({createdAt:-1});
    }else{
      return res.status(403).json({message:"Access denied"});
    }

    res.json(queries);

  }catch(error){
    res.status(500).json({message:error.message});
  }
};


const replyQuery=async(req,res)=>{
  try{
    const user=await Users.findById(req.user.id);

    if(!user||user.role!=="alumni"){
      return res.status(403).json({message:"Only alumni can reply"});
    }

    const query=await Query.findById(req.params.id);

    if(!query){
      return res.status(404).json({message:"Query not found"});
    }

    query.reply=req.body.reply;
    query.status="Answered";

    await query.save();

    res.json({
      message:"Reply submitted successfully",
      query
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }
};


module.exports={
  createQuery,
  getQueries,
  replyQuery
};