const mongoose=require("mongoose")
const url = "mongodb://127.0.0.1/EmployeeDB";

mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(err)
    {
        console.log("ERROR in the DB connection:",err)
    }
    else{
        console.log("MongoDB connection Successfull.....")
    }
})
