const router= require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const Book=require("../models/book");
const {authenticateToken}=require("./userAuth");

//add book -admin
//add book -admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const user = await User.findById(id);
      if (user.role !== "admin") {
        return res.status(400).json({ message: "You cant access to perform admin duties" });
      }
      const { url, title,  price, desc, language ,author} = req.body;
      if (!author) {
        return res.status(400).json({ message: "Author field is required" });
      }
      const book = new Book({
        url,
        title,
        
        price,
        desc,
        language,
        author,
      });
      await book.save();
      res.status(200).json({ message: "Book Added Successfully" });
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  });
//update book
router.put("/update-book", authenticateToken, async(req,res)=>{
    try{
        const{bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title:  req.body.title,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
            author: req.body.author,
        });
        return res.status(200).json({message:"Book Updates Successfully"});
    }catch(error){
        
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});
//delete book
router.delete("/delete-book", authenticateToken, async(req,res)=>{
    try{
        const{bookid}=req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Book Deleted Successfully"});
    }catch(error){
        
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});

//get-all-books
router.get("/get-all-book", async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt: -1});
        return res.json({status:"Success",data:books});
    }catch(error){
        
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});
//get-recently-all-books
router.get("/get-recent-book", async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({status:"Success",data:books});
    }catch(error){
        
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});

//get-book-by-id
//get-all-books
router.get("/get-book-by-id/:id", async(req,res)=>{
    try{
        const{id}=req.params;
        const book= await Book.findById(id);
        return res.json({status:"Success",data:book});
    }catch(error){
        
        console.log(error)
        res.status(500).json({message:"internal server error"});
    }
});
module.exports= router;