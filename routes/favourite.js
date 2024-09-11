const router=require("express").Router();
const User=require("../models/user");
const{authenticateToken}=require("./userAuth");

//add-book-favourite
router.put("/add-book-to-favourite", authenticateToken, async(req,res)=>{
    try{
        const{bookid,id}=req.headers;
        const userdata=await User.findById(id);
        const isBookfav=userdata.favourites.includes(bookid);
        if(isBookfav)
        {
            return res.status(200).json({message:"Book is already in favourites"});
        }
        await User.findByIdAndUpdate(id,{$push: {favourites:bookid}});
        return res.status(200).json({message:"Book added to favourites"});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
//delete-book-from-favourite
router.put("/remove-book-from-favourite", authenticateToken, async(req,res)=>{
    try{
        const{bookid,id}=req.headers;
        const userdata=await User.findById(id);
        const isBookfav=userdata.favourites.includes(bookid);
        if(isBookfav)
        {
            await User.findByIdAndUpdate(id,{$pull: {favourites:bookid}});
        }
       
        return res.status(200).json({message:"Book removed from favourites"});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

//get fav books
router.get("/get-favourite-books", authenticateToken, async(req,res)=>{
    try{
        const{id}=req.headers;
        const userdata=await User.findById(id).populate("favourites");
        const favbooks=userdata.favourites;
        return res.json({status:"Successful",data:favbooks});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
module.exports= router;