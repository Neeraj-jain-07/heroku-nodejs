const Job = require('../moduls/jobs')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,Unauthorization,NotFoundError} =require('../errors')


const getAllJobs = async(req,res) => {
    console.log('hi')
   const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
   res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getjob = async(req,res) => {
    const {user:{userId},params:{id:jobId}}=req

    const job = await Job.findOne({
        _id:jobId,
        createdBy:userId
    })
    if(!job){ // this is not working error is not showing rightly
        throw new NotFoundError(`No jobId with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job,count:job.length})
}

const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res) => {
    console.log("flag update")
    const { body:{company,position} , user:{userId},params:{id:jobId}}=req
     console.log("f 2")
    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
      }
      console.log(jobId,userId)
      console.log("f 3")
    const job = await Job.findByIdAndUpdate({
        _id:jobId,
        createdBy:userId
    },req.body,
    { new: true, runValidators: true }
    )
    console.log("f 4")
    if(!job){ // this is not working error is not showing rightly
        throw new NotFoundError(`No jobId with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req,res) => {
    const {user:{userId},params:{id:jobId}}=req

    const job = await Job.findByIdAndUpdate({
        _id:jobId,
        createdBy:userId
    })

    if(!job){ // this is not working error is not showing rightly
        throw new NotFoundError(`No jobId with ${jobId}`)
    }
    res.status(StatusCodes.OK).send("deleted successfully")
}

module.exports = {
    getAllJobs,getjob,createJob,updateJob,deleteJob
}