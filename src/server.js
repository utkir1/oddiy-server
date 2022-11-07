import express from 'express'
import { read, write } from './utils/FS.utils.js'
import { ErrorHandler } from './errors/ErrorHandler.js'
import { errorHandling } from './middlewares/errorHandler.middleware.js'
import { EmployeePostValidation, EmployeePutValidation, JobPostValidation, JobPutValidation, ParamValidation } from './validation/validation.js'

const app = express()

app.use(express.json())

app.get('/employees/list', async(_, res) => {
  const allWorkers = await read('workers.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  if(allWorkers)  res.status(200).json({
    message: "Worker's list has been successfully retracted",
    data: allWorkers
  })
})

app.post('/employees/register', async(req, res, next) => {

  const { error, value } = EmployeePostValidation.validate(req.body)

  if(error) {
    next(new ErrorHandler(error.message, 400))
    return
  }

  const allWorkers = await read('workers.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const { name, age, password, gender,jobId } = value

  if(allWorkers) allWorkers.push({ id : allWorkers.at(-1)?.id + 1 || 1, name, password, age, gender, jobId })

  const newWorker = await write('workers.model.json', allWorkers)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(newWorker)  res.status(201).json({
    message: "Worker has been created"
  })

})

app.put('/employees/update/:id', async(req, res, next) => {

  const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new ErrorHandler(error.message, 400))
  }

  const { id } = value

  const {error: putError, value: putValue } = EmployeePutValidation.validate(req.body)

  const allWorkers = await read('workers.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const foundUser = allWorkers.find(e => e.id == id)

  if(putError) {
    return next(new ErrorHandler(putError.message, 400))
  }

  const { name, age, password, gender, jobId } = putValue

  if(!foundUser) {
    return next(new ErrorHandler(`Worker with this ${id} id is not found`, 404))
  }

  foundUser.name = name || foundUser.name
  foundUser.password = password || foundUser.password
  foundUser.age = age || foundUser.age
  foundUser.gender = gender || foundUser.gender
  foundUser.jobId = jobId || foundUser.jobId

  const updatedWorker = await write('workers.model.json', allWorkers)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(updatedWorker)  res.status(200).json({
    message: "Worker has been updated"
  })

})

app.delete('/employees/delete/:id', async(req, res, next) => {
  const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new ErrorHandler(error.message, 400))
  }

  const { id } = value

  const allWorkers = await read('workers.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const index = allWorkers.findIndex(e => e.id == id)

  if(index == -1) {
    return next(new ErrorHandler(`Worker with this ${id} id is not found`, 404))
  }

  allWorkers.splice(index, 1)

  const deletedWorker = await write('workers.model.json', allWorkers)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(deletedWorker)  res.status(200).json({
    message: "Worker has been deleted"
  })
})


app.get('/jobs/list', async(_,res) => {
  const allJobs = await read('jobs.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  if(allJobs)  res.status(200).json({
    message: "Job's list has been successfully retracted",
    data: allJobs
  })
})

app.get('/jobs/list/:id', async(req,res) => {

  const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new ErrorHandler(error.message, 400))
  }

  const { id } = value

  const allJobs = await read('jobs.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

   const foundJob = allJobs.find(e => e.id == id)

  const allWorkers = await read('workers.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))


  foundJob.workers = allWorkers.filter(e => e.jobId == id)

  if(foundJob)  res.status(200).json({
    message: "Job has been successfully retracted",
    data: foundJob
  })
})

app.post('/jobs/register', async(req, res, next) => {

  const { error, value } = JobPostValidation.validate(req.body)

  if(error) {
    next(new ErrorHandler(error.message, 400))
    return
  }

  const allJobs = await read('jobs.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const { title, workersId } = value

  if(allJobs) allJobs.push({ id : allJobs.at(-1)?.id + 1 || 1, title, workersId})

  const newJob = await write('jobs.model.json', allJobs)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(newJob)  res.status(201).json({
    message: "Job has been created"
  })

})

app.put('/jobs/update/:id', async(req, res, next) => {

  const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new ErrorHandler(error.message, 400))
  }

  const { id } = value

  const {error: putError, value: putValue } = JobPutValidation.validate(req.body)

  const allJobs = await read('jobs.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const foundJob = allJobs.find(e => e.id == id)

  if(putError) {
    return next(new ErrorHandler(putError.message, 400))
  }

  const { title, workersId } = putValue

  if(!foundJob) {
    return next(new ErrorHandler(`Job with this ${id} id is not found`, 404))
  }

  foundJob.title = title || foundJob.title
  foundJob.workersId = workersId || foundJob.workersId


  const updated = await write('jobs.model.json', allJobs)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(updated)  res.status(200).json({
    message: "Job has been updated"
  })

})

app.delete('/jobs/delete/:id', async(req, res, next) => {
  const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new ErrorHandler(error.message, 400))
  }

  const { id } = value

  const allJobs = await read('jobs.model.json')
  .catch(err =>  next(new ErrorHandler(err, 500)))

  const index = allJobs.findIndex(e => e.id == id)

  if(index == -1) {
    return next(new ErrorHandler(`Job with this ${id} id is not found`, 404))
  }

  allJobs.splice(index, 1)

  const deleted = await write('jobs.model.json', allJobs)
  .catch(err => next(new ErrorHandler(err, 500)))

  if(deleted)  res.status(200).json({
    message: "Job has been deleted"
  })
})



app.use(errorHandling)

app.all('/*', (req, res) => res.status(404).json({
  message: req.url + " is not found"
}
))

app.listen(9090, console.log(9090))