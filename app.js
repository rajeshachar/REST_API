//modules required in this project
const express=require("express")
const hbs=require("hbs")
const path=require("path")
const bodyparser=require("body-parser")
const session=require("express-session")
const flash = require('express-flash');
 const app=express()
require("./database/db")
const Register=require("./database/models/reg_employees")
const alog=require("./database/models/admin_UP")

const port=process.env.PORT || 4000
//path for pages
const static_path=path.join(__dirname,"/public/")
const template_path=path.join(__dirname,"/templates/views")
const partials_path=path.join(__dirname,"/templates/partials")
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(static_path))
app.use(session({
    secret:'my display',
    saveUninitialized: true,
    resave: false
}));
  
app.use(flash());
  

app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)
//Route to Index page
app.get("/",(req,res)=>{
    res.render("index")
})
//Route to Login page
app.get("/login",function(req,res){
    res.render("login")
})
//Route to Admin Home page
app.get("/ahome",function(req,res){
    res.status(200).render("ahome",{un:"Admin"})
})
//Route to Register page
app.get("/register",function(req,res){
    res.render("register")
})
//Route to Admin Login page
app.get("/alogin",function(req,res){
    res.render("alogin")
})
app.use((req,res,next)=>{
    res.locals.message=req.session.message
    delete req.session.message
    next()
})
//Server side POST method of Register
app.post("/register", (req,res)=>
{
        try{
            
            const password=req.body.pwd
            const cpwd=req.body.cpwd
                
                        const regEmployee= new Register({
                            fullname:req.body.fname,
                            username:req.body.uname,
                            email:req.body.email,
                            phone:req.body.phone,
                            gender:req.body.gender,
                            password:req.body.pwd,
                            confirmpassword:req.body.cpwd
    
                        })
                        regEmployee.save((err,doc)=>
                        {
                            if(!err)
                            {
                                //req.flash('success',"Record Inserted Successfully!!....")
                                // req.session.message={
                                //     type:'success',
                                //     intro:"Record Inserted Successfully....",
                                //     message:"Please Check in the list!!...."
                                // }                            
                                res.status(200).redirect("/")
                            }
                            else
                            {
                                if(err.name=="ValidationError")
                                {
                                    handleValidationError(err,req.body);
                                    res.render("register",{
                                        employee:req.body,
                                        
                                    })
     
                                }
                               //console.log("Error during record insertion :"+err)
    
                            }
                        })
               
            }
            catch(err)
            {
                res.status(400).send(err)
            }
        
  
   
})
function handleValidationError(err,body)
{
    for(item in err.errors)
    {
        switch(err.errors[item].path)
        {
            case 'fullname':body['fullNameError']=err.errors[item].message
                            break;
            case 'username':body['userNameError']=err.errors[item].message
                            break;
            case 'email':body['emailError']=err.errors[item].message
                         break;
            case 'phone':body['phoneError']=err.errors[item].message
                         break;
            case 'gender':body['genderError']=err.errors[item].message
                          break;
            case 'password':body['pwdError']=err.errors[item].message
                            break;
            case 'confirmpassword':body['cpwdError']=err.errors[item].message
                                   break;

            default:break;
        }
    }
}
//Server side POST method of Login
app.post("/login",async (req,res)=>{
        try
        {
        
            const uname=req.body.uname
            const pwd=req.body.pwd
            if(uname==""&&pwd=="")
            {
                res.render("login",{emp:"This field is required."})
            }
            else
            {
                const usname= await Register.findOne({username:uname})
                if(usname.password===pwd)
                {
                    console.log(usname)
                    res.status(200).render('home',{un:`${uname}`})
                }
                else{
                    res.render("login",{
                        employee:"Invalid login credentials."
                    })
                }
            }
        

        }
        catch(err)
        {
                res.render("login",{
                    employee:"Invalid login credentials."
                })
        }
    
})
//Route to employee logs Page
app.get("/emplog", function(req,res){
    Register.find((err,docs)=>{
          if(!err)
          {
              res.render("emplog",{list:docs})
          }
          else{
              console.log("Error in retrieving employees list:",err )
          }
    })
})
//Route to employee insertion page
app.get("/addemp", function(req,res){
    Register.find((err,docs)=>{
          if(!err)
          {
              res.render("addemp",{employee:docs,vtitle:"Insert",b:"Add"})
          }
          else{
              console.log("Something went wrong please check connection of add employee page ",err )
          }
    })
})
//Route to employee insert or update page
app.post("/addorup", (req,res)=>
{
        if(req.body._id=="")
        {
            insertRecord(req,res);
        }
        else{
            updateRecord(req,res);
        }
            
})
function insertRecord(req,res)
{
    try{
        
        const password=req.body.pwd
        const cpwd=req.body.cpwd
            
                    const regEmployee= new Register({
                        fullname:req.body.fname,
                        username:req.body.uname,
                        email:req.body.email,
                        phone:req.body.phone,
                        gender:req.body.gender,
                        password:req.body.pwd,
                        confirmpassword:req.body.cpwd

                    })
                    regEmployee.save((err,doc)=>
                    {
                        if(!err)
                        {
                            //req.flash('success',"Record Inserted Successfully!!....")
                            req.session.message={
                                type:'success',
                                intro:"Record Inserted Successfully....",
                                message:"Please Check in the list!!...."
                            }                            
                            res.status(200).redirect("/emplog")
                        }
                        else
                        {
                            if(err.name=="ValidationError")
                            {
                                handleValidationError(err,req.body);
                                res.render("addemp",{
                                    employee:req.body,
                                    vtitle:"Insert",b:"Add"
                                })
 
                            }
                           //console.log("Error during record insertion :"+err)

                        }
                    })
           
        }
        catch(err)
        {
            res.status(400).send(err)
        }
    
}
function updateRecord(req,res)
{
        Register.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,doc)=>{
            if(!err)
            {
               // req.flash('update',"Record Updated Successfully!!....")
               req.session.message={
                type:'success',
                intro:"Record Successfully Updated..",
                message:"Please check in the list!!...."
            }   
                res.redirect("/emplog")
            }
            else{
                console.log("ERROR during the updating record.."+err)
            }
        })
}
    
//Server side POST method of Admin Login   
app.post("/alogin",async (req,res)=>{
    try{
        
        const uname=req.body.uname
        const pwd=req.body.pwd
        if(uname==""&&pwd=="")
        {
                res.render("alogin",{emp:"This field is required."})
        }
        else
        {
            const usname= await alog.findOne({username:uname})
        
            if(usname.password===pwd)
            {
                res.status(200).render('ahome',{un:`${uname}`})
            }
            else{
                res.render("login",{
                    employee:"Invalid login credentials."
                })
    
            }
        }
        

    }
    catch(err)
    {
        res.render("alogin",{
            employee:"Invalid login credentials."
        })

    }

})
//Route to update page with retrieving all fields values
app.get("/:id", (req,res)=>{
    Register.findById(req.params.id,(err,doc)=>{
        if(!err)
        {
            res.status(200).render("addemp",{
                vtitle:"Update",
                b:"Update",
                employee:doc
            })
        }
        else{
            console.log("Error Cannot get Update page:",err )
        }

    })
})
//Delete the record based on the ID
app.get("/delete/:id",(req,res)=>{
    Register.findByIdAndRemove(req.params.id, function (err, doc) {
            if (!err) 
            {
                //req.flash('delete',"Record Deleted Successfully!!....")
                req.session.message={
                    type:'success',
                    intro:"Record Successfully Deleted..",
                    message:"Please check in the list!!...."
                }   
                res.status(200).redirect("/emplog")
            }
            else {
                console.log("EROR during employee delete!!...." + err)
            }
        })
})
//Server connection
app.listen(port,(err)=>{
    if(err)
    {
        console.log("Server is not connected!!!.....")
    }
    else{
        console.log("Server is connected on port:",port)
    }
})

