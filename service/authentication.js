const jwt = require('jsonwebtoken');
const secretkey = "sparsh@1234"


const setuserToken = async (user)=>{

    const payload ={

        _id:user._id,
        name:user.name,
        password:user.password,
        role:user.role,
        profileImage:user.profileImage
    }

    const token =jwt.sign({payload},secretkey, { expiresIn: '24h' })
   
    return token;
    

}


const getuserToken = (token) =>{

    const check =token;
    return jwt.verify(check,secretkey);

    
}



module.exports = {setuserToken,getuserToken};