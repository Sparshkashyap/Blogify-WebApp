
const { profile } = require('console');
const mongoose = require('mongoose');

const userblog = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    coverImg:{
        type:String,
        require:false
    },
    body:{
        type:String,
        require:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    
},{timestamps:true});

const blog = mongoose.model("blog",userblog);

module.exports = blog;