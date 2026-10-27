const mongoose=require("mongoose");

const schema=new mongoose.Schema({
  queryId:{
    type:String,
    required:true,
    unique:true
  },
  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users",
    required:true
  },
  studentName:{
    type:String,
    required:true
  },
  studentEmail:{
    type:String,
    required:true
  },
  subject:{
    type:String,
    required:true
  },
  question:{
    type:String,
    required:true
  },
  reply:{
    type:String,
    default:""
  },
  status:{
    type:String,
    enum:["Pending","Answered"],
    default:"Pending"
  }
},{timestamps:true});

module.exports=mongoose.model("Query",schema,"Queries");