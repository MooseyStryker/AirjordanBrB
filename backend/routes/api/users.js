const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Makes sure firstName, lastName, email, username, password is valid
// const validateSignup = [
//     check('email')
//       .exists({ checkFalsy: true })
//       .isEmail()
//       .withMessage('Please provide a valid email.'),
//     check('username')
//       .exists({ checkFalsy: true })
//       .isLength({ min: 4 })
//       .withMessage('Please provide a username with at least 4 characters.'),
//     check('username')
//       .not()
//       .isEmail()
//       .withMessage('Username cannot be an email.'),
//     check('password')
//       .exists({ checkFalsy: true })
//       .isLength({ min: 6 })
//       .withMessage('Password must be 6 characters or more.'),
//     check('firstName')
//       .exists({ checkFalsy: true })
//       .withMessage('First Name is required.'),
//     check('lastName')
//       .exists({ checkFalsy: true })
//       .withMessage('Last Name is required.'),
//     handleValidationErrors
//   ];

// Sign up

// validateSignup,

router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  let errors = {};

  // Check for missing fields
  if (!firstName) {
    errors.firstName = "First Name is required";
  }

  if (!lastName) {
    errors.lastName = "Last Name is required";
  }

  if (!email) {
    errors.email = "Invalid email";
  }

  if (email.length < 6) {
    errors.email = 'Password must be 6 characters or more.';
   }

  if (!username) {
    errors.username = "Username is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  const existingUser = await User.unscoped().findOne({ where: { [Op.or]: [{ email }, { username }]}});
  if (existingUser) {
    if (existingUser.email === email) {
      errors.email = "User with that email already exists";
    }
    if (existingUser.username === username) {
      errors.username = "User with that username already exists";

    }
  }

  // If there are errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(500).json({
      message: "User already exists",
      errors: errors
    });
  }

  // If there are no errors, create the user
  try {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });


    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const constraintErrors = err.errors.map((error) => error.message);
      return res.status(409).json({
        message: "Validation error",
        errors: constraintErrors
      });
    }
    // handle other types of errors
    return res.status(500).json({ message: err.message });
  }
});








module.exports = router
