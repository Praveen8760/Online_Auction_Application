// package imports
const express = require('express');
const route=express.Router();


// function file imports
const UserModel=require('../schema/user_schema');
const send_registered_email = require('../src/javascript/email_sender');
const hash_password = require('../src/javascript/password_hashing');
const passport = require('passport');

const fs=require('fs')
const path=require('path')



// routes

route.get('/register',(request,response)=>{
    response.render("register")
})

route.post('/register',async(request,response)=>{
    let {body} =request;
    
    // hashing performed 
    body.password=hash_password(body.password);
    
    try{
        const existingUser=await UserModel.findOne({'email':body.email});
        if(existingUser){
            response.redirect('/register')
        }
        else{
            const newUser=new UserModel({email:body.email,fullname:body.fullname,password:body.password});
            await newUser.save();
            const templatePath = path.join(process.cwd(), 'views', 'email', 'registerEmail.ejs');
            send_registered_email(body,templatePath);
            return response.redirect('/login')
        }
    }
    catch(err){
        console.log("Register error");
    }
})


module.exports=route;