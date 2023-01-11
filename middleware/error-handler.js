const {CustomAPIError}= require('../errors')
const {StatusCodes} = require('http-status-codes')



const errorHandlerMiddleware = (err,req,res,next)=>{
    // if(err instanceof CustomAPIError){
    //     return res.status(err.statusCode).json({msg:err.message})
    // }
    // console.log(err)
    const object1 ={
       message:err.message || "Something went wrong , please try again",
       statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
     if(err.code===11000){
         object1.statusCode = 400
         object1.message = `Your are trying to enter someone else ${Object.keys(err.keyValue)} , please enter your real  ${Object.keys(err.keyValue)}`
     }
     if(err.name === "ValidationError"){
        object1.statusCode =400
        object1.message=Object.values(err.errors).map((item) => item.message).join(" ,")
     }
     if(err.name === "CastError"){
         object1.statusCode = 404
         object1.message = `no job fount with id ${err.value}`
     }

    // return res.status(object1.statusCode).json({err})          
    return res.status(object1.statusCode).json({msg:object1.message})
   
}

module.exports = errorHandlerMiddleware     