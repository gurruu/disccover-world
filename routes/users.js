const express=require('express')
const router=express.Router()
const passport=require('passport')
const User=require('../models/user')
const catchAsync = require("../utils/catchAsync");

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async (req,res,next)=>{
    try
    {
  const {email,username,password}=req.body;
    const user=new User({email,username})
    const regUser=await User.register(user,password)
    req.login(regUser,(err)=>{
        if(err)return next(err)
          req.flash("success", "heyy!!  Welcome to Yelpcamp");
          res.redirect("/campgrounds");
    })
  
    }
    catch(e)
    {
        req.flash('error',e.message)
        res.redirect('/register')
    }
  

}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,(req,res)=>{

    req.flash('success','welcome Back')
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)

})

router.get('/logout',(req,res)=>{
req.logout();
req.flash('success','Good Bye....See You Again!!!!')
res.redirect('/campgrounds')

})

module.exports=router;