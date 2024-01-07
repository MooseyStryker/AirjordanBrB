const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', restoreUser, requireAuth, async (req,res, next) => {
    try{

        const thisImageId = req.params.imageId;
        const image = await GroupImage.findByPk(thisImageId);


        if(!image){
            return res.status(404).json(
                {
                    message: "Group Image couldn't be found"
            });
        }

        const group = await Group.findByPk(image.groupId)

        if(!group) return res.status(403).json({"message": "Group couldn't be found"})

        console.log(image)
        console.log(group.organizerId)
        console.log(Membership.status)

        if (group.organizerId !== req.user.id && Membership.status !== 'co-host') {
            return res.status(403).json({
                message: "You don't have permission to create this events"
            });
        }
        await image.destroy();
        res.status(200).json({ message: 'Successfully deleted' });
      } catch (error) {
        next(error);
      }
})




module.exports = router;
