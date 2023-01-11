require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT || 4001


//security Packets
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
app.use(express.json());
// connectDB
const connectDB = require('./db/connection')
const authUserMiddleware = require('./middleware/authentication')

app.set('trust proxy', 1)
app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
app.use(helmet())
app.use(cors())
app.use(xss())

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authUserMiddleware,jobRouter)
app.get('/',(req,res)=>{
    res.status(200).send(`Welcome to Job Api <br> <a href="/api/v1/jobs">Click here</a>`)
})

app.get('*',(req,res)=>{
    res.status(500).send("Route does not exist")
})
// app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async() => {
    try{
        await connectDB(process.env.MONGO_DB)
        app.listen(port,()=>{
        console.log(`app is listening at port ${port}`)
             })
    }
    catch(err){
        console.log(err)
    }
}

start()