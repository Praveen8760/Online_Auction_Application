// package import
const express=require('express')
const route=express.Router()


// function import
const compare_password = require('../src/javascript/compare_password')
const UserModel=require('../schema/user_schema')
const passport = require('passport')





route.get('/login',(request,response)=>{
    if(request.isAuthenticated()){
        return response.redirect('/home')
    }    
    return response.render('login')
})


route.post('/login',passport.authenticate('local'),(request,response)=>{
    if(request.user){
        console.log(request.user);
        return response.redirect('/home');
    }
    else{
        return response.render('/login');
    }
})


route.get('/status',(request,response)=>{
    if(request.user){
        console.log(request.user);
        return response.send("test")
    }
    else{
        return response.sendStatus(403);
    }
})

module.exports=route;