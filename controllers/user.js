
const { error } = require('console');
const USER = require('../models/user');
const blog = require('../models/blog');
const {setuserToken,getuserToken} = require('../service/authentication');
const { AsyncLocalStorage } = require('async_hooks');



// create a new user

const createuser = async (req,res)=>{

    try{

    const {name,email,password} = req.body;

    if(!name || !email || !password){

        throw new error("input is empty")
    }

    const newuser = await USER.create({

        name,
        password,
        email

    });

    if(!newuser){
        return res.redirect('/user/signup');
    }

    return res.redirect('/user/signin');
}
catch(err){
    return res.render('signup',{
        error:"Please fill the details"
    })
}
}



// generate the token and enter the home page
const checkuser = async (req,res)=>{

    const {email,password} = req.body;

    const allblog = await blog.find({});

    try{

    const user =await USER.matchpassword(email,password);

    const token =await setuserToken(user);

    res.cookie("token",token,{
        httpOnly:true,
        httpsOnly:true,
        maxAge:24*60*60*1000
    });
    
    // console.log(req.user.name);

    const test =await req.cookies["token"];
    
    return res.redirect('/');

    }
    catch(err){

        return res.render("login",{
            error:"Incorrect email or password"
        });
    }

}


module.exports = {createuser,checkuser};