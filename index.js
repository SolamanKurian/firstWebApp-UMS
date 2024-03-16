const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")

const nocache=require("nocache")
const express=require("express")
const path=require("path")

const app=express()
app.use("/static",express.static(path.join(__dirname,"public")))
app.use(nocache())
//user route
const userRoute=require('./routs/userRouts')
app.use('/',userRoute)


//admin route
const adminRoute=require('./routs/adminRouts')
app.use('/admin',adminRoute)



app.listen(3000,()=>{
    console.log("App is running")
})