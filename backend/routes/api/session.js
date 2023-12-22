const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Ensures the credentials (username) and password are both filled
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post('/', validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {

        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

// Log out
router.delete('/',(_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


// Restore session user
router.get('/',(req, res) => {
    const { user } = req;

    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });

    } else return res.json({ user: null });
  }
);

// VL1Jj0ta-6jqy1jdvlMM-WL0BXdV0zVVJdSg
module.exports = router;
