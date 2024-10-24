// const passport=require('passport');
// const GoogleUser = require('../schema/google_user');
// const User=require('../schema/user_schema');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;


// passport.serializeUser((user,done)=>{
//     done(null,user.email);
// })


// passport.deserializeUser(async(id,done)=>{
//     console.log("deserial");
//     try{
//         const findUser=await GoogleUser.findOne({email:id});
//         if(findUser){
//             done(null,findUser.email);
//         }
//     }
//     catch(err){
//         done(err,null);
//     }
// })

// // save the keys 

// passport.use(new GoogleStrategy({
//     clientID:"981191217881-dcf58kqr70p4am3dn70hlr7plg52ic1i.apps.googleusercontent.com",
//     clientSecret: "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",
//     callbackURL: "http://localhost:3000/google/redirect",
//     // passReqToCallback   : true,
//     scope:['email','profile']
// },
// async (accessToken, refreshToken, profile, done) => {
//     try {
//         const existingUser = await GoogleUser.findOne({ email: profile.emails[0].value });
//         if (existingUser) {
//             return done(null, existingUser);
//         } else {
//             const newUser = new GoogleUser({
//                 fullname: profile.displayName,
//                 email: profile.emails[0].value,
//                 photo: profile.photos[0].value,
//             });
//             const savedUser = await newUser.save();
//             return done(null, savedUser);
//         }
//     } catch (err) {
//         return done(err);
//     }
// }));

