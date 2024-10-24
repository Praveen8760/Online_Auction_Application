const LocalStrategy=require('passport-local');
const passport=require('passport');
const UserModel=require('../schema/user_schema');
const compare_password = require('../src/javascript/compare_password');

passport.serializeUser((user,done)=>{
    console.log("serial");
    done(null,user.email);
})

passport.deserializeUser(async(id,done)=>{
    console.log("deserial");
    try{
        const findUser=await UserModel.findOne({email:id});
        if(findUser){
            done(null,findUser.email);
        }
    }
    catch(err){
        done(err,null);
    }
})

passport.use(
    new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
        console.log(username);
        try{
            const findUser=await UserModel.findOne({email:username});
            let user_password=findUser.password;
            if(findUser){
                if(await compare_password(password,user_password)){
                    done(null,findUser);
                }
                else{
                    throw new Error("Wrong password");
                }
            }
            else{
                throw new Error("User not found");
            }
        }
        catch(err){
            done(err,null);
        }
    })
)