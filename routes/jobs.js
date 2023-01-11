const express = require('express')
const { get } = require('mongoose')
const router = new express.Router()

const {getAllJobs,getjob,createJob,updateJob,deleteJob} = require('../controllers/jobs')

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getjob).delete(deleteJob).patch(updateJob)

module.exports = router