const express=require("express")
const session=require("express-session")
const config=require("../config/config")

const user_route=express()


user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:false,
    resave:false
}))
const auth=require('../middleware/auth')

user_route.set("view engine","ejs")
user_route.set('views','./views/users')
const bodyParser =require("body-parser")
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))
user_route.use(express.static('public'))

const userController=require("../controllers/userController")


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

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',upload.single('image') ,userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

user_route.get('/edit',auth.isLogin,userController.editLoad)

user_route.post('/edit',upload.single('image'),userController.updateProfile)

module.exports=user_route;