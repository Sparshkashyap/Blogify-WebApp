const mongoose = require('mongoose');


const ConnectDB = () =>{ 


    const a ="mongodb+srv://sparshkashyap:sparshkashyap@userblogs.krycwst.mongodb.net/?retryWrites=true&w=majority&appName=UserBlogs" 
    // const a = "mongodb://127.0.0.1:27017/blogify"   

    mongoose.connect(a)
    .then(()=>console.log("mongodb connected...🎉"))
    .catch((err)=>console.log(err));
    
    
}


module.exports = {ConnectDB};