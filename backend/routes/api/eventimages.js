const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();


router.delete('/:imageId', restoreUser, requireAuth, async (req, res, next) => {
    try {
      const imageId = req.params.imageId;
      const image = await EventImage.findByPk(imageId);

      if (!image) {
        return res.status(404).json({ message: "Event Image couldn't be found" });
      }

      const event = await Event.findByPk(image.eventId);
      const group = await Group.findByPk(event.groupId);
      const membership = await Membership.findOne({ where: { userId: req.user.id, groupId: group.id } });

    
      if (group.organizerId !== req.user.id && (!membership || membership.status !== 'co-host')) {
        return res.status(403).json({
          message: "You don't have permission to delete this image"
        });
      }

      await image.destroy();
      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
