const{authenticateToken}=require("./userAuth");
const Book=require("../models/book")
const Order=require("../models/order")
const router=require("express").Router();
const User=require("../models/user");
//place order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const { order } = req.body;
      for (const orderData of order) {
        const newOrder = new Order({ user: id, book: orderData._id });
        const orderDataFromDB = await newOrder.save();
        await User.findByIdAndUpdate(id, {
          $push: { orders: orderDataFromDB._id },
        });
        // Remove the order from the cart
        await User.findByIdAndUpdate(id, {
          $pull: { cart: orderData._id },
        });
      }
      return res.json({
        status: "Success",
        message: "Order placed Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });
//getorderhistory
router.get("/get-order-history", authenticateToken,async(req,res)=>{
    try{
        const{id}=req.headers;
    const userdata= await User.findById(id).populate({
        path:"orders",
        populate:{path:"book"},
    });
    return res.json({
        status:"Successful",
        data:userdata.orders,
    });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});

    } 
});
//getallorders
router.get("/get-all-orders", authenticateToken,async(req,res)=>{
    try{
        const userdata= await Order.find().populate({
            path:"book",
    })
    .populate({
        path:"user",
    })
    .sort({createdAt:-1});
    return res.json({
        status:"Successful",
        data:userdata,
    });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});

    } 
});

//update order by admin
router.put("/update-status/:id",authenticateToken,async(req,res)=>{
    try{
        const{id}=req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"Successful",
            message:"Status Updates Successfully",
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
});
module.exports=router;