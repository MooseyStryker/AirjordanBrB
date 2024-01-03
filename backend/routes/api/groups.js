const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser, requireAuth } = require('../../utils/auth');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const groupData = await Group.findAll();

    res.json({
        Groups: groupData
    })
});

router.get('/current', restoreUser, requireAuth, async (req, res) => {
    console.log('this is the req',req)
    const { user } = req;
    if (!user) {
        const err = new Error('Please login or sign up');
        err.status = 401;
        err.title = 'User authentication failed';
        return next(err);
    }

    const groupData = await Group.findAll({
        where: {
            [Op.or]: [
                { organizerId: user.id}
            ]
        },
        include: [{
            model: Membership,
            attributes: ['status']
        }]

    }
    );

    console.log(groupData);

    res.json({
        Groups: groupData
    })
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            GroupImage,
            {
                model: User,
                as: 'Organizer',
                attributes:['id', 'firstName', 'lastName']
            },
            Venue]
    });

    if (group) {
        res.json(group);
    } else {
        res.status(404).json({
            message: "Group couldn't be found"
        });
    }
});


router.post('/', restoreUser, requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req

    if (!user) {
        const err = new Error('Please login or sign up');
        err.status = 401;
        err.title = 'User authentication failed';
        return next(err);
    }

    try {
        const newGroup = await Group.create({
            organizerId: user.id,
            name,
            about,
            type,
            private,
            city,
            state
        })
        res.status(201).json({
            message: 'Group Successfully Added',
            data: newGroup
        }
        )
    } catch (error) {
        if(error instanceof Sequelize.ValidationError) {

            return res.status(400).json({
                message: 'Validation Error',
                errors: error.errors.map(e => {
                  console.log(e);
                  return {
                    [e.path]: e.message
                  };
                })
              });
        }

        res.status(400).json({
            message: 'Bad Request'
        })
    }
})

router.delete('/:groupId', restoreUser, requireAuth, async (req, res) => {
    const groupDelete = await Group.findByPk(req.params.groupId)

    if(!groupDelete) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    groupDelete.destroy();

    res.json({
        'message': "Successfully deleted"
    })
})




module.exports = router;
