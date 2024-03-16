const express=require("express")
const admin_route=express()
const adminController=require("../controllers/adminController")
const config=require("../config/config")
const auth=require("../middleware/adminAuth")
admin_route.use(express.static('public'))
//settings for file upload storage
const multer=require("multer")
const path=require("path")
const storage=multer.diskStorage({destination:(req,file,cb)=>{
    cb(null,path.join(__dirname, '../public/userimages'))
}, filename:(req,file,cb)=>{
const name=Date.now()+'-'+file.originalname;
cb(null,name)
}});
const upload=multer({storage:storage})
//upto here

const session=require("express-session")

admin_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:false,
    resave:false
}))


const bodyParser=require("body-parser")
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))
admin_route.set("view engine","ejs")
admin_route.set("views","./views/admin")

admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/home',auth.isLogin,adminController.loadDashboard)
admin_route.get('/logout',auth.isLogin,adminController.adminLogout)
admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)
admin_route.get('/new-user',auth.isLogin,adminController.newuserLoad)
admin_route.post('/new-user',upload.single('image'),adminController.addnewUser)
admin_route.get('/edit-user',auth.isLogin,adminController.edituserLoad)
admin_route.post('/edit-user',adminController.updateUser)
admin_route.get('/delete-user',auth.isLogin,adminController.deleteUser)



admin_route.get('*',(req,res)=>{

    res.redirect('/admin')

})






module.exports= admin_route;