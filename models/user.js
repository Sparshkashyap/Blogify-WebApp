const { timeStamp, error } = require("node:console");
const { randomBytes } = require("crypto");
const crypto = require('crypto');
const findOrCreate = require("mongoose-findorcreate");

const mongoose = require('mongoose');
const { type } = require("node:os");

const userScehma = new mongoose.Schema({

    // googleId :{
    //     type:String,
    //     reuire:true
    // },
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    profileImage:{
        type: String,
        default:"/images/man.png"
    }
}, { timestamps: true });


userScehma.pre("save", function (next) {

    const user = this;

    if (!user.isModified("password")) {
        return;
    }

    const salt = randomBytes(16).toString("hex");
    const hashpassword = crypto.createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashpassword;

    next();

})

userScehma.static("matchpassword", async function (email, password) {

    const check = await USER.findOne({ email });    

    if (!check) throw new error("User not defined")

    const salt = check.salt;

    const hashpassword = check.password;

    const newhashpassword = crypto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');

        // console.log(password);
        // console.log(newhashpassword);
        

    if ( hashpassword != newhashpassword) {
        
       throw new error("password is not right")
    }    

    return check;
})


userScehma.plugin(findOrCreate); // ✅ Use the plugin


const USER = mongoose.model('user', userScehma);
module.exports = USER