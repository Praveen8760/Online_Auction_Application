const bcrpt = require('bcrypt');

async function compare_password(password,dbpassword){
    try{
        const result=bcrpt.compareSync(password,dbpassword);
        return result;
    }
    catch(err){
        console.log("Passwor Error");
    }
}

module.exports = compare_password;