const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
    },
    age:{
        type:Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age Must be a Positive Number')
            }
        },
        default: 0
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Is not a Valid Email');
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password is not Secure please try again');
            }
        }
    }
})

userSchema.pre('save',async function(next){
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;