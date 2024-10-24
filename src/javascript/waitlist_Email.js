const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs=require('ejs')
const path = require('path')
const express=require('express')

require('dotenv').config();


async function send_registered_email(user,auction){
    const templatePath = path.join(process.cwd(), 'views', 'email', 'waitingList.ejs');
    const userName=user.fullname;
    const htmlTemplate = await ejs.renderFile(templatePath, { userName ,auction });

    let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
    })
    let mailOption={
        from:'praveen890340@gmail.com',
        to:user.email,
        subject:"Auction to Your Waiting List",
        html:htmlTemplate
    }
    // sending the mail
    try{
        let info=await transporter.sendMail(mailOption);
        console.log("email sent");
    }
    catch(err){
        console.log(err);
    }
}


module.exports = send_registered_email;