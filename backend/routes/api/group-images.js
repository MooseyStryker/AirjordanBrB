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

        const membership = await Membership.findOne({
            where : {
                groupId: image.groupId
            }
        })

        console.log("🚀 ~ router.delete ~ membership:", membership)
        // console.log("🚀 ~ router.delete ~ membership.status:", membership.status)
        console.log("🚀 ~ router.delete ~ req.user.id:", req.user.id)
        console.log("🚀 ~ router.delete ~ group.organizerId:", group.organizerId)



        if (group.organizerId !== req.user.id) {
            if (!membership || membership.status !== 'co-host') {
                return res.status(403).json({
                    message: "You don't have permission to create this events"
                });
            }
        }

        await image.destroy();
        res.status(200).json({ message: 'Successfully deleted' });
      } catch (error) {
        next(error);
      }
})




module.exports = router;
