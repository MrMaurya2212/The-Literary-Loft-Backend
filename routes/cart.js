const router=require("express").Router();
const User=require("../models/user");
const{authenticateToken}=require("./userAuth");

//add-to-cart
router.put("/add-to-cart", authenticateToken, async(req,res)=>{
    try{
        const{bookid,id}=req.headers;
        const userdata=await User.findById(id);
        const isfavbook= userdata.cart.includes(bookid);
        if(isfavbook){
            return res.json({
                status:"Success",
                message:"Book is already in cart",
            });
        }
        await User.findByIdAndUpdate(id,{
            $push:{cart:bookid},
        });
        return res.json({
            status:"Success",
            message:"Book added to cart",
        });
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

//remove-book
router.put("/remove-from-cart/:bookid", authenticateToken, async(req,res)=>{
    try{
        const{bookid}=req.params;
        const {id}= req.headers;
        
        await User.findByIdAndUpdate(id,{
            $pull:{cart:bookid},
        });
        return res.json({
            status:"Success",
            message:"Book removed from cart",
        });
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
//get-user-cart
router.get("/get-user-cart", authenticateToken, async(req,res)=>{
    try{
        const {id}= req.headers;
        const userdata=await User.findById(id).populate("cart");
        const cart=userdata.cart.reverse();
        return res.json({
            status:"Success",
            data: cart,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
});
module.exports= router;