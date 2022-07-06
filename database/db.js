//database connection
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
//Database: EmployeeDB
// EmployeeDB contains two tables
// 1. admin_credential : This contains admin Credentials
// 2. employees : This table contains all inserted records[Note: Id is automatically created by database]