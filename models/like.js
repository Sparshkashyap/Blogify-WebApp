const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

    blogId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    },
    likecount:{
        type:Number,
        required:false,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})



module.exports = mongoose.model("like",likeSchema);