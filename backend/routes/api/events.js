const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();

// Helper funcs

const processEventList = (EventList) => {
    const ensuresThisIsAnArray = Array.isArray(EventList) ? EventList : [EventList]; // Converts findByPk and findOne to array

    const eventList = ensuresThisIsAnArray.map(event => {

        const eventJSON = event.toJSON();
        // If the event has Attendances, counth them, if not set the count to 0.
        if (event.Attendances){
            eventJSON.numAttending = event.Attendances.length;
        } else {
            eventJSON.numAttending = 0;
        }

        // If the event has images, find the first one with a url and set it as the preview image
        if (event.EventImages && event.EventImages.length > 0) {
            const image = event.EventImages.find(img => img.url);

            if (image) {
                eventJSON.previewImage = image.url
            }
        }

        // Remove membership, eventimages properties
        delete eventJSON.Attendances;
        delete eventJSON.EventImages;

        console.log(eventJSON)
        return eventJSON
    })
    return eventList
}

router.get('/', async (req, res, next) => {
    try{
        const events = await Event.findAll({
            include:[
                // {model: Attendence},
                {model: EventImage},
                {
                model: Group,
                attributes: ['id','name','city','state']
                },
                {
                    model:Venue,
                    attributes:['id', 'city', 'state']
                }
            ]
        });

        const eventList = processEventList(events);

        res.json({Events: eventList})
    } catch (error){
        next(error)
    }
})

router.get('/:eventId', async (req, res, next) => {
    try{
        const thisEventId = req.params.eventId

        const events = await Event.findAll({
            where: {
                groupId: thisEventId
            },
            include:[
                {model: Attendence},
                {model: EventImage.scope('basicInfo')},
                {
                    model: Group,
                    attributes: ['id','name','city','state']
                },
                {
                    model:Venue,
                    attributes:['id', 'city', 'state']
                }
            ]
        });

        // Needs to keep EventImages
        const processEventListKeepImages = (EventList) => {
            const ensuresThisIsAnArray = Array.isArray(EventList) ? EventList : [EventList];
            const eventList = ensuresThisIsAnArray.map(event => {
                const eventJSON = event.toJSON();
                if (event.Attendances){
                    eventJSON.numAttending = event.Attendances.length;
                } else {
                    eventJSON.numAttending = 0;
                }
                if (event.EventImages && event.EventImages.length > 0) {
                    const image = event.EventImages.find(img => img.url);

                    if (image) {
                        eventJSON.previewImage = image.url
                    }
                }
                delete eventJSON.Attendances;
                return eventJSON
            })
            return eventList
        }

        if(events) {
            const eventList = processEventListKeepImages(events);
            res.json({Events: eventList})
        } else {
            res.status(404).json({
                message: "Group couldn't be found"
            });
        }
    } catch (error){
        next(error)
    }
})

router.get('/:eventId/attendees', async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        let attendees = await Attendence.findAll({
            where: { eventId: event.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            attributes: ['status'],
        });


        attendees = attendees.map(attendee => ({
            id: attendee.User.id,
            firstName: attendee.User.firstName,
            lastName: attendee.User.lastName,
            Attendence: {
                status: attendee.status
            },
        }));

        if (req.user && (event.organizerId === req.user.id || req.user.status === 'co-host')) {
            res.status(200).json({ Attendees: attendees });
        } else {
            const filteredAttendees = attendees.filter(attendee => attendee.Attendence.status !== 'pending');
            res.status(200).json({ Attendees: filteredAttendees });
        }
    } catch (err) {
        console.error('Error: ', err);
        next(err);
    }
});









/*          POST         */
router.post('/:eventId/images', restoreUser, requireAuth, async (req, res, next) => {
    try{
        const thisEventId = req.params.eventId;
        const{ url, preview } = req.body;

        const event = await Event.findByPk(thisEventId);


        if(event.groupId === null || !event) return res.status(403).json({"message": "event couldn't be found"})

        const group = await Group.findOne({
            where: {
                organizerId: req.user.id
            }
        });
        const membership = await Membership.findOne({
             where: {
                 userId: req.user.id,
                 groupId: group.id
                }
            });


        if (
            event.groupId !== req.user.id
            || membership.status !== 'co-host'
            || group.organizerId !== req.user.id
        ) {
            return res.status(403).json({
                message: "You don't have permission to create this venue"
            });
        }



        const image = await EventImage.create({
            url,
            preview
        })

        res.json({
            id: thisEventId,
            url: image.url,
            preview: image.preview
        })

    } catch (e) {
        next(e)
    }
})




/*          Edit             */
router.put('/:eventId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const thisEventId = req.params.eventId;
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;


        const event = await Event.findByPk(thisEventId);

        // If the event doesn't exist, return a 404 error
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }


        const group = await Group.findByPk(event.groupId);

        const membership = await Membership.findOne({ where: { userId: req.user.id, groupId: group.id } });


        if (group.organizerId !== req.user.id && (!membership || membership.status !== 'co-host')) {
            return res.status(403).json({ message: "You don't have permission to edit this event" });
        }


        await event.update({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate });


        res.status(200).json({
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        });
    } catch (error) {
        next(error);
    }
});


router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { userId, status } = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }


        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User couldn't be found" });
        }


        const attendance = await Attendence.findOne({
            where: {
                eventId,
                userId
            }
        });


        if (!attendance) {
            return res.status(404).json({ message: "Attendence does not exist for this User" });
        }

        if (status === 'pending') {
            return res.status(400).json({
                message: "Bad Request",
                errors: { status: "Cannot change an attendance status to pending" }
            });
        }

        
        const membership = await Membership.findOne(
            { where: {
                groupId: event.groupId,
                userId: req.user.id
            }
        });
        if (req.user.id !== event.organizerId && (!membership || membership.status !== 'co-host')) {
            return res.status(403).json({ message: "You don't have permission to edit this attendance" });
        }

        attendance.status = status;
        await attendance.save();

        res.status(200).json({
            id: attendance.id,
            eventId,
            userId,
            status
        });
    } catch (err) {
        console.error('Error: ', err);
        next(err);
    }
});






/*          DELETE           */
router.delete('/:eventId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const thisEventId = req.params.eventId;
        const event = await Event.findByPk(thisEventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }
        const group = await Group.findByPk(event.groupId);
        const membership = await Membership.findOne({
            where:
            {
                userId: req.user.id,
                groupId: group.id
            }
        });

        if (group.organizerId !== req.user.id && (!membership || membership.status !== 'co-host')) {
            return res.status(403).json(
                {
                    message: "You don't have permission to delete this event"
                });
        }

        await event.destroy();

        res.status(200).json(
            {
                message: "Successfully deleted"
            }
            );
    } catch (error) {
        next(error);
    }
});




router.delete('/:eventId/attendance/:userId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const { eventId, userId } = req.params;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User couldn't be found" });
        }

        const group = await Group.findByPk(userId);

        const attendance = await Attendence.findOne({
            where: {
                eventId,
                userId
            }
        });
        if (!attendance) {
            return res.status(404).json({ message: "Attendence does not exist for this User" });
        }

        console.log('req.user.id',req.user.id)
        console.log('event.organizerid',group.organizerId)
        console.log('userId', userId)

        if (req.user.id !== group.organizerId && req.user.id !== userId) {
            return res.status(403).json({ message: "You don't have permission to delete this attendance" });
        }

        await attendance.destroy();

        res.status(200).json({ message: "Successfully deleted attendance from event" });
    } catch (err) {
        console.error('Error: ', err);
        next(err);
    }
});


module.exports = router;
