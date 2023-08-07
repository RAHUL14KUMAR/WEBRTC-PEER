const mongoose=require("mongoose");

const url="mongodb://localhost:27017/restaurant"

const connect=mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

connect.then((db)=>{
    console.log("mongodb is connected sucessfully")
},(err)=>{
    console.log("we get error from mongoose connnection",err)
})