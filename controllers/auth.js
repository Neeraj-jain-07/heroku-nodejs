const User = require('../moduls/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,Un, Unauthorization} = require('../errors')

const register = async(req,res) => {
        const {name,email,password} = req.body
        const user = await User.create({...req.body}) //{...tempUser}
        console.log(user)
        const token = user.createJwtToken()
        res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
        
}

const login = async(req,res) => {
    const {email , password} = req.body

    if(!email || !password){
        throw new Unauthorization('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new Unauthorization("Invalid Credentials 1")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new Unauthorization("Invalid Credentials 2")
    }
    //compare password
    const token =user.createJwtToken()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {register,login}
