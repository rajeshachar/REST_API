const mongoose=require("mongoose")
const Schema=new mongoose.Schema({
    username:{
        type:String,
        default:"Admin",
        required:true
    },
    password:{
      type:String,
      default:"Admin@5454",
      required:true
  }
})
const alog=new mongoose.model('Admin_credential',Schema)

module.exports=alog