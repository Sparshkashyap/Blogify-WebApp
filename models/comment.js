
const mongoose = require('mongoose');

const newcomment = mongoose.Schema({

    content:{
        type:String,
        require:false
    },
    blogid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user" 
    }
});


const comment = mongoose.model('comment',newcomment);
module.exports = comment;