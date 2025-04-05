const mongoose = require('mongoose');


const newSchema = new mongoose.Schema({
    question:{
        type:String,
        reuire:false
    },
    name:{
        type:String,
        reuire:true
    },
    email:{
        type:String,
        require:true
    }
},{timestamps:true});


const ques = mongoose.model('ques',newSchema);

module.exports = ques;