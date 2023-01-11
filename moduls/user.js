const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlength:[3,'length of name at least 3 letters'],
        maxlength:30
    },
    email:{
        type:String,
        required:[true,'Please provide emial'],
        unique:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',]
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:[6,'password at least 6 digit']
    }
})

UserSchema.pre('save',async function(){
    const salt = await bycrypt.genSalt(10)
    this.password = await bycrypt.hash(this.password,salt)
})

UserSchema.methods.createJwtToken = function(){
    return jwt.sign( { userId:this._id   ,  name:this.name }   ,  process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME
     } )
}

UserSchema.methods.comparePassword = async function(condidatePassword){
   const flag = await bycrypt.compare(condidatePassword,this.password)
   return flag
}

module.exports = mongoose.model('User',UserSchema)