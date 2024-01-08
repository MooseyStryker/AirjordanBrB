const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();

router.put('/:venueId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const venuesId = req.params.venueId;
        ('This is the venue Id', venuesId)
        const { address, city, state, lat, lng } = req.body

        const venue = await Venue.findByPk(venuesId);

        if(!venue){
            return res.status(404).json({
                message: "Venue couldn't be found"
            })
        }

        const membership = await Membership.findOne({
            where: {
                userId: req.user.id,
                groupId: venue.groupId,
                status: 'co-host'
            }
        })


        if (!membership || membership.userId !== req.user.id) {
            return res.status(403).json({
                message: "You don't have permission to edit this venue"
            });
        }


        venue.address = address !== undefined ? address : venue.address;
        venue.city = city !== undefined ? city : venue.city;
        venue.state = state !== undefined ? state : venue.state;
        venue.lat = lat !== undefined ? lat : venue.lat;
        venue.lng = lng !== undefined ? lng : venue.lng;


        await venue.save();

        res.json(venue)


    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            let errors = {};
            error.errors.forEach(e => {
              errors[e.path] = e.message;
            });

            return res.status(400).json({
              message: 'Validation Error',
              errors: errors
            });
          }

          res.status(400).json({
            message: 'Bad Request'
          });
    }
})




module.exports = router;
