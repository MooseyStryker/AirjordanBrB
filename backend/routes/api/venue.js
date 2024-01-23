const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();



router.put('/:venueId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const { address, city, state, lat, lng } = req.body
        const venuesId = req.params.venueId;
        console.log("🚀 ~ router.put ~ venuesId:", venuesId)

        const venue = await Venue.findByPk(venuesId);
        console.log("🚀 ~ router.put ~ venue:", venue)

        const group = await Group.findByPk(venue.groupId)
        console.log("🚀 ~ router.put ~ group:", group)

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
        console.log("🚀 ~ router.put ~ membership:", membership)


        // if (!membership || group.organizerId !== req.user.id) {
        //     return res.status(403).json({
        //         message: "You don't have permission to edit this venue"
        //     });
        // }
        if (group.organizerId !== req.user.id && (!membership || membership.status !== 'co-host')) {
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

        const venueResponse = {
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng
          };

          res.json(venueResponse);


    } catch (error) {
        console.log(error)
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
