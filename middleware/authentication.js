
const {getuserToken} = require('../service/authentication');

const checkuserAuthenticationToken = (tokenname) =>{

    return  (req,res,next)=>{

        const tokenExist = req.cookies["token"];

        if(!tokenExist){

           return next();
        }

        try{

            const userpayload = getuserToken(tokenExist);
            req.user = userpayload;

        }
        catch(err){

            console.log("Invalid token",new Date().toLocaleTimeString());
            return next();
        }

       return next();
    }
}




module.exports ={checkuserAuthenticationToken};