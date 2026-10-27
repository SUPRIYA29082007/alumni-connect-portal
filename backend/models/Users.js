const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  userId:{type:String,required:true,unique:true},
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,default:""},
  role:{type:String,enum:["admin","alumni","student"],required:true},
  isApproved:{type:Boolean,default:false},
  department:{type:String,default:""},
  currentYear:{type:String,default:""},
  googleId:{type:String,unique:true,sparse:true},
  registeredAtIST:{type:String,default:""},
  lastLoginAtIST:{type:String,default:""},
  resetRequestedAtIST:{type:String,default:""},
  passwordResetAtIST:{type:String,default:""},
  resetPasswordToken:{type:String,default:""},
  resetPasswordExpires:{type:Date,default:null}
},{timestamps:true});
module.exports=mongoose.model("Users",schema,"Users");
