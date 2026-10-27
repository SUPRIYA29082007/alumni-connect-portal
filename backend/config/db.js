const mongoose=require("mongoose");

const connectDB=async()=>{
  try{
    const uri=process.env.MONGO_URI;

    if(!uri){
      throw new Error("MONGO_URI is missing in backend .env");
    }

    await mongoose.connect(uri,{dbName:"AlumniConnectDB"});

    console.log("================================");
    console.log("MONGODB CONNECTED");
    console.log("DATABASE:",mongoose.connection.name);
    console.log("HOST:",mongoose.connection.host);
    console.log("================================");
  }catch(error){
    console.log("MongoDB connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports=connectDB;