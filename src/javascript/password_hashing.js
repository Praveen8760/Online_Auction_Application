
const hash=require('bcrypt')

const salt=10;
function hashPassword(password){
    const salt=hash.genSaltSync(10)
    return hash.hashSync(password,salt)
}


module.exports = hashPassword;