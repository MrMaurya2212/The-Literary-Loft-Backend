const router= require("express").Router();
const User=require("../models/user");
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");
//Sign up
router.post("/sign-up", async(req,res)=>{
    try{
        const {username, email, password, address,avatar}=req.body;
        //check username length is more than 4
        if(username.length<=4){
            return res.status(400)
            .json({message:"username length should be more than 4"});
        }
        //check username already exists
        const existuname=await User.findOne({username:username});
        if(existuname){
            return res.status(400)
            .json({message:"username already exists"});
        }
        //existing email
        const existemail=await User.findOne({email:email});
        if(existemail){
            return res.status(400)
            .json({message:"email already exists"});
        }
        //pasword length
        if(password.length<=5){
            return res.status(400)
            .json({message:"password should be greater than 5"});
        }
        const hashpass= await bcrypt.hash(password,10);
        const newUser= new User({
            username:username,
            email: email,
            password: hashpass,
            address: address,
            avatar:avatar,
        });
        await newUser.save();
        return res.status(200).json({message:"Sign Up successfull"});
    }catch(errror){
        res.status(500).json({message:"internal server error"});
    }
});
//Sign IN
router.post("/sign-in", async (req, res) => {
    try {
      const { username, password } = req.body;
      const existuser = await User.findOne({ username });
      if (!existuser) {
        return res.status(400).json({ message: "invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, existuser.password);
      if (!isValid) {
        return res.status(400).json({ message: "invalid credentials" });
      }
      const authClaims = [
        { name: existuser.username },
        { role: existuser.role },
      ];
      const token = jwt.sign({ authClaims }, "library123", {
        expiresIn: "365d",
      });
      return res.status(200).json({ id: existuser.id, role: existuser.role, token: token });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  });
//Get User information
router.get("/get-user-information",authenticateToken,async (req,res)=>{
    try{
        const {id}=req.headers;
        const data= await User.findById(id).select("-password");
        return res.status(200)
        .json(data);
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
//update info
router.put("/update-address",authenticateToken, async (req,res)=>{
    try{
       const {id} =req.headers;
       const{address}=req.body; 
       await User.findByIdAndUpdate(id,{address:address});
       return res
       .status(200)
       .json({message:"Address Updated"});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
module.exports= router;