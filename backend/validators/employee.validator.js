const Joi = require("joi");

const createEmployeeSchema = Joi.object({
  user_id: Joi.number().required(),
  department_id: Joi.number().required(),
  phone: Joi.string().min(10).max(15).required(),
  address: Joi.string().required(),
  designation: Joi.string().required(),
  salary: Joi.number().min(0).required()
});

const validateEmployee = (req, res, next) => {
  const { error } = createEmployeeSchema.validate(req.body);
  if (error) {
    return res.status(422).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = { validateEmployee };