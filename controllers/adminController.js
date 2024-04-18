const User=require("../models/userModel")
const bcrypt=require("bcrypt")

const securePassword=async (password)=>{

    try {
       const passwordHash =await bcrypt.hash(password ,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

//method to login for admin

const loadLogin= async(req,res)=>
{

try {
    
    res.render('login')
    
} catch (error) {
    console.log(error.message);
}


}

//method to verify adminLogin

const verifyLogin= async (req,res)=>{


try {
    const email=req.body.email;
    const password=req.body.password;

        const userData= await User.findOne({email:email})
        if(userData){
            
                   const passwordMatch= await bcrypt.compare(password,userData.password);

                   if(passwordMatch){
                    if(userData.is_admin === "0"){

                        res.render('login',{message:"you are not admin"})
                    }else{
                        req.session.admin_id=userData._id;
                        res.redirect('/admin/home')
                    }


                   }else{
                    res.render('login',{message:"Invalid password"})
                   }

        }else{

            res.render('login',{message:"Invalid email"})
        }

} catch (error) {
    console.log(error.message);
}


}

// method to load Dashboard

const loadDashboard= async(req,res)=>{

    try {
        const userData= await User.findById({_id:req.session.admin_id})
        res.render('home',{admin:userData})

    } catch (error) {
        console.log(error.message)   
    }
}

// method to admin logout

const adminLogout=async(req,res)=>{


try {

    req.session.destroy()
    res.redirect('/admin')
} catch (error) {
    console.log(error.message);
}

}
//method for rendering admin dashboard

const adminDashboard= async(req,res)=>{


    try {
// searching
        let search="";
        if(req.query.search){
            search=req.query.search;
        }
        const userData= await User.find({is_admin:0,$or:[{name:{$regex:".*"+search+".*",$options:"i"}},
    {email:{$regex:".*"+search+".*",$options:"i"}}]})
        res.render('dashboard',{users:userData,srch:search})
    } catch (error) {
        console.log(error.message)
    }
}
//method to render new user add page

const newuserLoad= async(req,res)=>{

try {
    res.render('new-user')
} catch (error) {
    console.log(error.message);
}


}
//method to add new user to db

const addnewUser= async (req,res)=>{
try {


    const spassword = await securePassword(req.body.password);
    const user=new User({


        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mno,
        image:req.file.filename,
        password:spassword,
        is_admin:0,

    }) 

    const userData= await user.save()

    if(userData){

        res.redirect('/admin/dashboard')

    }
    else{
        res.render('new-user',{message:'Something went wrong'})
    }



    
} catch (error) {
    console.log(error.message);
}


}

//method to render user edit page for admin

const edituserLoad=async(req,res)=>{

try {

    const id=req.query.id;
    const userData= await User.findById({_id:id})
    if(userData){

        res.render('edit-user',{user:userData})
    }
    else{
        res.redirect('/admin/dashboard')
    }

    
    
} catch (error) {
    console.log(error.message);
}

}

//method to update user

const updateUser= async(req,res)=>{

try {

const updated= await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
res.redirect('/admin/dashboard')
    
} catch (error) {
    console.log(error.message);
}



}
//method to delete user

const deleteUser=async (req,res)=>{

try {

    const id=req.query.id;
 await User.deleteOne({_id:id})
 res.redirect('/admin/dashboard')
    
} catch (error) {
    console.log(error.message);
}
}

module.exports={
    
    loadLogin,
    verifyLogin,
    loadDashboard,
    adminLogout,
    adminDashboard,
    newuserLoad,
    addnewUser,
    edituserLoad,
    updateUser,
    deleteUser

}