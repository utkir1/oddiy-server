import Joi from "joi";


export const ParamValidation = Joi.object().keys({
  id: Joi.number().required()
})

export const EmployeePostValidation = Joi.object().keys({
  name: Joi.string().required().max(20).min(3),
  age: Joi.number().required().min(18),
  gender: Joi.string().required().valid("male", "female"),
  password: Joi.alternatives().try(Joi.string().required(), Joi.number().required()),
  jobId: Joi.array().items(Joi.number().required()).required()
})

export const EmployeePutValidation = Joi.object().keys({
  name: Joi.string().max(20).min(3),
  age: Joi.number().min(18),
  gender: Joi.string().valid("male", "female"),
  password: Joi.alternatives().try(Joi.string().required(), Joi.number().required()),
  jobId: Joi.array().items(Joi.number().required())
})

export const JobPostValidation = Joi.object().keys({
  title: Joi.string().required().max(20).min(3),
  workersId : Joi.array().items(Joi.number().required()).required()
})

export const JobPutValidation = Joi.object().keys({
  title: Joi.string().max(20).min(3),
  workersId : Joi.array().items(Joi.number().required())
})