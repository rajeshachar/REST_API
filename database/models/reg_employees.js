  const mongoose=require("mongoose")
  const validator=require("validator")
  const employeeSchema=new mongoose.Schema({
      fullname:{
          type:String,
          required:"This field is required.",
          minLength:[4,'Minimum 4 characters.'],
          validate(value)
          {
              if(!validator.isAlpha(value))
              {
                  throw new Error("Name Should contain letters only.")
              }
          }

      },
      username:{
        type:String,
        required:"This field is required.",
        minLength:[4,'Minimum 4 characters.'],
        validate(value)
        {
            if(!validator.isAlphanumeric(value))
            {
                throw new Error("Name Should contain letters and numbers.")
            }
        }
        
    },
    email:{
        type:String,
        required:"This field is required.",
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email format.")
            }
        }
    },
    phone:{
        type:Number,
        required:"This field is required."
    },
    gender:{
        type:String,
        required:"This field is required."
    
    },
    password:{
        type:String,
        required:"This field is required.",
        minlength:[4,"Password must contain 4 characters."]
    },
    confirmpassword:{
        type:String,
        required:"This field is required.",
        validate(value)
        {
            if(!(this.password===value))
            {
                throw new Error("Passwords do not match.")
            }
        }
        
    
        
    }
  })
employeeSchema.path('phone').validate((val)=>{
  phoneno = /^\d{10}$/;
  return phoneno.test(val);
},"Invalid phone number.")


const Register=new mongoose.model('Employee',employeeSchema)

employeeSchema.path('email').validate(async(val)=>{
    try
    {
        const usname= await Register.findOne({email:val})
        if((usname.email===val))
        {
            return false
        }
    }catch(err)
    {
        return true
    }
   

},"Email already exists.")
employeeSchema.path('username').validate(async(val)=>{
    try
    {
        const usname= await Register.findOne({username:val})
        if((usname.username===val))
        {
            return false
        }
    }catch(err)
    {
        return true
    }
    

},"Username already exists.")
employeeSchema.path('phone').validate(async(val)=>{
    try{
        const usname= await Register.findOne({phone:val})
        if((usname.phone===val))
        {
            
            return false
        }
       
    }catch(err)
    {
        return true
    }
   
},"Phone number already exists.")



module.exports=Register