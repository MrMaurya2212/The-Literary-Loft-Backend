const mongoose= require("mongoose");
const conn=async()=>{
    try{
        await mongoose.connect(`${process.env.URI}`); 
        console.log("Connected to Databse");
    }catch(error){
        console.log(error);
    }
};
conn();