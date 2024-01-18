const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// var permitted = ['admin', 'user', 'lead-guide', 'guide'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a vaild email']
    },
    photo: String,
    role: {
        type: String,
        required: [true, 'A role must have user or admin value'],
        default: 'admin',
        enum: {
            values: ['admin', 'user', 'lead-guide', 'guide'],
            message: 'Admin and lead-guide only access to delete the user'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // this only works on CREATE and SAVE!!
            validator: function(el) {
                return el === this.password;
            }
        }
    }, 
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// pre-save middleware
userSchema.pre('save', async function(next) {
    // only run when password is modified 
    if (!this.isModified('password')) return next(); // if not modified it will run as it is

    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12); // convert password to encrypt version with a cost of 12, not to make it easy

    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// QUERY middleware
userSchema.pre(/^find/, function(next){
    // this points to the current query (find query in -- userController.getAllUsers)
    this.find({ active: { $ne: false } });

    next();
});

// INSTANCE METHOD -- methods can be acessed from any file

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword); // function returns true or false if password is same or not
}; 

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(this.passwordChangedAt, JWTTimestamp);

        // console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }

    // False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); // non-ecrypted token

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // encrypted token

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken
}

const User = mongoose.model('User', userSchema); // creates model for user schema

module.exports = User;