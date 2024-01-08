const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  // If there are validation errors, create an error with all the validation error messages and invoke the next error-handling middleware
  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach(error => {
      if (error.param === 'email') {
        errors.email = 'Invalid email';
      } else if (error.param === 'username') {
        errors.username = 'Username is required';
      } else if (error.param === 'firstName') {
        errors.firstName = 'First Name is required';
      } else if (error.param === 'lastName') {
        errors.lastName = 'Last Name is required';
      }
    });

    const err = Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    next(err);
  }

  // If there are no validation errors returned from the validationResult function, invoke the next middleware.
  next();
};

module.exports = {
  handleValidationErrors
};
