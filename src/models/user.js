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
        lowercase: true,
        unique: true
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
// Hash passwords
userSchema.pre('save',async function(next){
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// Find Users Credentials
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email:email});
    if(!user){
        throw new Error('Unable To Login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable To Login');
    }
    return user
}

const User = mongoose.model('User',userSchema);

module.exports = User;