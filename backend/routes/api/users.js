const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Makes sure email, username, password is valid
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
// router.post('/', validateSignup, async (req, res) => {
//       const { firstName, lastName, email, password, username } = req.body;
//       const hashedPassword = bcrypt.hashSync(password);
//       const user = await User.create({ firstName, lastName, email, username, password, hashedPassword });

//       const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastname: user.lastName,
//         email: user.email,
//         username: user.username,
//       };

//       await setTokenCookie(res, safeUser);

//       return res.json({
//         user: safeUser
//       });
//     }
//   );

router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "User with that email already exists"
          }
        });
      } else if (existingUser.username === username) {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            username: "User with that username already exists"
          }
        });
      }
    }

    // Create the user
    const user = await User.create({ firstName, lastName, email, username, password, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  } catch (err) {
    // Handle any other errors
    return res.status(400).json({
      message: "Bad Request",
      errors: err.errors
    });
  }
});




module.exports = router
