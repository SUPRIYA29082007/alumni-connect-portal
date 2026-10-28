
const Users=require("../models/Users");
const Alumni=require("../models/Alumni");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const {Resend}=require("resend");
const {OAuth2Client}=require("google-auth-library");

const googleClient=process.env.GOOGLE_CLIENT_ID?new OAuth2Client(process.env.GOOGLE_CLIENT_ID):null;

const tokenFor=u=>jwt.sign(
    {id:u._id,userId:u.userId,name:u.name,role:u.role},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
);

const istNow=()=>new Intl.DateTimeFormat("en-IN",{
    timeZone:"Asia/Kolkata",
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit",
    hour12:true
}).format(new Date());

const register=async(req,res)=>{
    try{
        const {
            userId,name,email,password,role,department,currentYear,
            rollNumber,graduationYear,mobile,companyName,designation,skills,bio
        }=req.body;

        if(!userId||!name||!email||!password||!role)
            return res.status(400).json({message:"All fields are required"});

        if(!["student","alumni"].includes(role))
            return res.status(400).json({message:"Use the separate admin registration form for admin accounts"});

        if(password.length<6)
            return res.status(400).json({message:"Password must contain at least 6 characters"});

        if(await Users.findOne({email}))
            return res.status(400).json({message:"Email already registered"});

        if(await Users.findOne({userId}))
            return res.status(400).json({message:"User ID already exists"});

        const hash=await bcrypt.hash(password,10);
        const now=istNow();

        const user=await Users.create({
            userId,name,email,password:hash,role,
            isApproved:role==="student",
            department:department||"",
            currentYear:currentYear||"",
            registeredAtIST:now
        });

        if(role==="alumni"){
            if(!rollNumber||!graduationYear||!department||!mobile){
                await Users.findByIdAndDelete(user._id);
                return res.status(400).json({message:"Alumni profile fields are required"});
            }

            await Alumni.create({
                alumniId:`AL-${user.userId}`,
                userId:user._id,
                alumniName:name,
                rollNumber,
                graduationYear:Number(graduationYear),
                department,
                companyName:companyName||"",
                designation:designation||"",
                email,
                mobile,
                skills:skills||"",
                bio:bio||""
            });
        }

        res.status(201).json({
            message:role==="alumni"?"Alumni registration submitted for admin approval":"Student registration successful",
            userId:user.userId,
            mongoId:user._id,
            role:user.role,
            isApproved:user.isApproved,
            registeredAtIST:now
        });
    }catch(e){
        console.log("REGISTRATION ERROR:",e);
        res.status(500).json({message:"Registration failed",error:e.message});
    }
};

const registerAdmin=async(req,res)=>{
    try{
        const {userId,name,email,password,adminKey}=req.body;

        if(adminKey!==process.env.ADMIN_REGISTRATION_KEY)
            return res.status(403).json({message:"Invalid admin registration key"});

        if(!userId||!name||!email||!password)
            return res.status(400).json({message:"All fields are required"});

        if(await Users.findOne({email}))
            return res.status(400).json({message:"Email already registered"});

        if(await Users.findOne({userId}))
            return res.status(400).json({message:"User ID already exists"});

        const hash=await bcrypt.hash(password,10);
        const now=istNow();

        await Users.create({
            userId,name,email,password:hash,role:"admin",
            isApproved:true,
            registeredAtIST:now
        });

        res.status(201).json({message:"Admin registration successful",registeredAtIST:now});
    }catch(e){
        res.status(500).json({message:"Admin registration failed",error:e.message});
    }
};

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email||!password)
            return res.status(400).json({message:"Email and password are required"});

        const u=await Users.findOne({email});

        if(!u)
            return res.status(404).json({message:"User not found"});

        if(u.role!=="student"&&!u.isApproved)
            return res.status(403).json({message:"Alumni registration is waiting for admin approval"});

        if(!u.password||!(await bcrypt.compare(password,u.password)))
            return res.status(401).json({message:"Invalid email or password"});

        const now=istNow();
        u.lastLoginAtIST=now;
        await u.save();

        res.json({
            message:"Login successful",
            token:tokenFor(u),
            user:{id:u._id,userId:u.userId,name:u.name,email:u.email,role:u.role}
        });
    }catch(e){
        res.status(500).json({message:"Login failed",error:e.message});
    }
};

const googleLogin=async(req,res)=>{
    try{
        if(!googleClient)
            return res.status(503).json({message:"Google Sign-In is not configured. Add GOOGLE_CLIENT_ID to backend .env."});

        const {credential}=req.body;

        if(!credential)
            return res.status(400).json({message:"Google credential is required"});

        const ticket=await googleClient.verifyIdToken({
            idToken:credential,
            audience:process.env.GOOGLE_CLIENT_ID
        });

        const payload=ticket.getPayload();

        if(!payload?.email||!payload.email_verified)
            return res.status(401).json({message:"Google email could not be verified"});

        let u=await Users.findOne({email:payload.email.toLowerCase()});
        const now=istNow();

        if(!u){
            const base=(payload.email.split("@")[0]||"student")
                .replace(/[^a-zA-Z0-9]/g,"")
                .slice(0,20)||"student";

            let userId=`GOOGLE-${base.toUpperCase()}`;
            let n=1;

            while(await Users.findOne({userId}))
                userId=`GOOGLE-${base.toUpperCase()}${n++}`;

            u=await Users.create({
                userId,
                name:payload.name||base,
                email:payload.email.toLowerCase(),
                password:"",
                role:"student",
                isApproved:true,
                googleId:payload.sub,
                registeredAtIST:now,
                lastLoginAtIST:now
            });
        }else{
            if(!u.googleId)u.googleId=payload.sub;
            u.lastLoginAtIST=now;
            await u.save();
        }

        res.json({
            message:"Google sign-in successful",
            token:tokenFor(u),
            user:{id:u._id,userId:u.userId,name:u.name,email:u.email,role:u.role}
        });
    }catch(e){
        console.log("GOOGLE LOGIN ERROR:",e.message);
        res.status(401).json({message:"Google sign-in failed"});
    }
};

const pendingAlumni=async(req,res)=>{
    const users=await Users.find({role:"alumni",isApproved:false})
        .select("name email userId createdAt registeredAtIST")
        .sort({createdAt:-1});

    res.json(users);
};

const approveAlumni=async(req,res)=>{
    const u=await Users.findOneAndUpdate(
        {_id:req.params.userId,role:"alumni"},
        {isApproved:true},
        {new:true}
    );

    if(!u)
        return res.status(404).json({message:"Alumni user not found"});

    res.json({message:"Alumni approved",user:u});
};

const forgotPassword=async(req,res)=>{
    try{
        const email=(req.body.email||"").trim().toLowerCase();

        const u=await Users.findOne({email});

        const safe={
            message:"If the account exists, a password reset link has been sent to the registered email address."
        };

        if(!u)return res.json(safe);

        if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM_EMAIL){
            return res.status(503).json({
                message:"Email service is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL."
            });
        }

        const resend=new Resend(process.env.RESEND_API_KEY);

        const raw=crypto.randomBytes(32).toString("hex");

        u.resetPasswordToken=crypto.createHash("sha256").update(raw).digest("hex");
        u.resetPasswordExpires=new Date(Date.now()+15*60*1000);
        u.resetRequestedAtIST=istNow();

        await u.save();

        const link=`${process.env.FRONTEND_URL||"http://localhost:5173"}/reset-password?token=${raw}`;

        const {data,error}=await resend.emails.send({
            from:process.env.RESEND_FROM_EMAIL,
            to:[u.email],
            subject:"Alumni Connect - Password Reset",
            text:`Hello ${u.name},

Use this link to reset your Alumni Connect password. It expires in 15 minutes:
${link}

Reset requested at (IST): ${u.resetRequestedAtIST}

If you did not request this, ignore this email.`,
            html:`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:30px;border:1px solid #e5e7eb;border-radius:18px">
<h2 style="color:#4f46e5">Alumni Connect</h2>
<p>Hello ${u.name},</p>
<p>We received a request to reset your password.</p>
<p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:9px;font-weight:700">Reset Password</a></p>
<p>This link expires in <b>15 minutes</b>.</p>
<p style="color:#667085;font-size:13px">Requested at (IST): ${u.resetRequestedAtIST}</p>
<p style="color:#667085;font-size:12px">If you did not request this, you can safely ignore this email.</p>
</div>`
        });

        if(error){
            console.log("RESEND EMAIL ERROR:",error);
            return res.status(502).json({message:"Could not send reset email"});
        }

        res.json(safe);
    }catch(e){
        console.log("FORGOT PASSWORD ERROR:",e);
        res.status(500).json({message:"Could not send reset email"});
    }
};

const resetPassword=async(req,res)=>{
    try{
        const hash=crypto.createHash("sha256").update(req.body.token||"").digest("hex");

        const u=await Users.findOne({
            resetPasswordToken:hash,
            resetPasswordExpires:{$gt:new Date()}
        });

        if(!u)
            return res.status(400).json({message:"Invalid or expired reset link"});

        if(!req.body.password||req.body.password.length<6)
            return res.status(400).json({message:"Password must contain at least 6 characters"});

        u.password=await bcrypt.hash(req.body.password,10);
        u.resetPasswordToken="";
        u.resetPasswordExpires=null;
        u.passwordResetAtIST=istNow();

        await u.save();

        res.json({
            message:"Password reset successful",
            passwordResetAtIST:u.passwordResetAtIST
        });
    }catch(e){
        res.status(500).json({message:"Password reset failed"});
    }
};

module.exports={
    register,
    registerAdmin,
    login,
    googleLogin,
    pendingAlumni,
    approveAlumni,
    forgotPassword,
    resetPassword
};
