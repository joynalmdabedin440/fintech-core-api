const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email must be provided"],
        unique: [true, "Email already exist"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        
        
    },
    name: {
        type: String,
        required:[true,"Name must be require to provide"]
    },
    password: {
        type: String,
        required: [true, "Password must be require"],
        minlength: [6, "password must be 6 character"],
        select:false
    }
})