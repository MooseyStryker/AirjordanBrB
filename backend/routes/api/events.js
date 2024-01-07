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

        if (event.Attendences){
            eventJSON.numAttending = event.Attendences.length;
        } else {
            eventJSON.numAttending = 0;
        }

        if (event.EventImages && event.EventImages.length > 0) {
            const image = event.EventImages.find(img => img.url);

            if (image) {
                eventJSON.previewImage = image.url
            }
        }


        delete eventJSON.Attendences;
        delete eventJSON.EventImages;

        console.log(eventJSON)
        return eventJSON
    })
    return eventList
}




router.get('/', async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;
        const name = req.query.name;
        const type = req.query.type;
        const startDate = req.query.startDate;

        const isWhere = {};
        if (name) isWhere.name = { [Op.like]: `%${name}%` };
        if (type) isWhere.type = type;
        if (startDate) isWhere.startDate = { [Op.gte]: startDate };

        const errors = {};
        if (page < 1 || page > 10) errors.page = "Page must be greater than or equal to 1 and less than or equal to 10";
        if (size < 1 || size > 20) errors.size = "Size must be greater than or equal to 1 and less than or equal to 20";
        if (name && typeof name !== 'string') errors.name = "Name must be a string";
        if (type && type !== 'Online' && type !== 'In Person') errors.type = "Type must be 'Online' or 'In Person'";
        if (startDate && isNaN(Date.parse(startDate))) errors.startDate = "Start date must be a valid datetime";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors: errors
            });
        }

        const events = await Event.findAll({
            where: isWhere,
            include:[
                {model: Attendence},
                {model: EventImage},
                {
                model: Group,
                attributes: ['id','name','city','state']
                },
                {
                    model:Venue,
                    attributes:['id', 'city', 'state']
                }
            ],
            limit: size,
            offset: (page - 1) * size
        });

        const eventList = processEventList(events);

        res.json({Events: eventList})


    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const sequelizeErrors = error.errors.reduce((acc, err) => {
                switch (err.path) {
                    case 'page':
                        acc[err.path] = "Page must be greater than or equal to 1 and less than or equal to 10";
                        break;
                    case 'size':
                        acc[err.path] = "Size must be greater than or equal to 1 and less than or equal to 20";
                        break;
                    case 'name':
                        acc[err.path] = "Name must be a string";
                        break;
                    case 'type':
                        acc[err.path] = "Type must be 'Online' or 'In Person'";
                        break;
                    case 'startDate':
                        acc[err.path] = "Start date must be a valid datetime";
                        break;
                    default:
                        acc[err.path] = err.message;
                }
                return acc;
            }, {});
            return res.status(400).json({
                message: "Validation error",
                errors: sequelizeErrors
            });
        }
        next(error);
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
                    attributes: ['id','name','city','state','private'],
                    include: [
                        {
                            model:Venue,
                            attributes:['id', 'address', 'city', 'state', 'lat', 'lng']
                        }
                    ]
                },

            ]
        });
        // Needs to keep EventImages
        const processEventListKeepImages = (EventList) => {
            const ensuresThisIsAnArray = Array.isArray(EventList) ? EventList : [EventList];
            const eventList = ensuresThisIsAnArray.map(event => {
                const eventJSON = event.toJSON();
                if (event.Attendences){
                    eventJSON.numAttending = event.Attendences.length;
                } else {
                    eventJSON.numAttending = 0;
                }
                if (event.EventImages && event.EventImages.length > 0) {
                    const image = event.EventImages.find(img => img.url);

                    if (image) {
                        eventJSON.previewImage = image.url
                    }
                }

                if (event.Group.Venues && event.Group.Venues.length > 0) {
                    eventJSON.Venue = event.Group.Venues[0];
                } else {
                    eventJSON.Venue = null;
                }

                delete eventJSON.Attendences;
                delete eventJSON.Group.Venues;
                delete eventJSON.previewImage;

                return eventJSON
            })
            return eventList
        }

        if(events.length > 0) {
            const eventList = processEventListKeepImages(events);
            if (eventList.length > 0) {
                res.json(eventList[0]); // Send only the first event object
            } else {
                res.status(404).json({
                    message: "No events found for this group"
                });
            }
        } else {
            res.status(404).json({
                message: "Group couldn't be found"
            });
        }
    } catch (error){
        next(error)
    }
});




router.get('/:eventId/attendees', async (req, res, next) => {
    try {
        const thisEventId = req.params.eventId;
        const event = await Event.findByPk(thisEventId);

        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        const group = await Group.findByPk(event.groupId);
        const existingMembership = group && req.user ? await Membership.findOne({
            where:{
                groupId: group.id,
                userId: req.user.id
            }
        }) : null;

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

        const userIsOrganizer = req.user && group && group.organizerId === req.user.id;
        const userIsCoHost = existingMembership && existingMembership.status === 'co-host';

        if (userIsOrganizer || userIsCoHost) {
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


        if(!event || event.groupId === null) return res.status(403).json({"message": "Event couldn't be found"})

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

router.post('/:eventId/attendance', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const thisEventId = req.params.eventId;
        const userId = req.user.id;

        const event = await Event.findByPk(thisEventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        const group = await Group.findByPk(event.groupId);
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }

        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: userId
            }
        });

        if (!membership) {
            return res.status(403).json({ message: "Current User must be a member of the group" });
        }

        const existingAttendance = await Attendence.findOne({
            where: {
                eventId: thisEventId,
                userId: userId
            }
        });

        if (existingAttendance) {
            if (existingAttendance.status === 'pending') {
                return res.status(400).json({ message: "Attendance has already been requested" });
            } else if (existingAttendance.status === 'attending') {
                return res.status(400).json({ message: "User is already an attendee of the event" });
            }
        }

        const newAttendance = await Attendence.create({
            eventId: thisEventId,
            userId: userId,
            status: 'pending'
        });

        return res.status(200).json({
            userId: userId,
            status: 'pending'
        });
    } catch (err) {
        console.error('Error: ', err);
        next(err);
    }
});




/*          Edit             */
router.put('/:eventId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const thisEventId = req.params.eventId;
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const errors = {};
        if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
        if (!type || (type !== 'Online' && type !== 'In Person')) errors.type = "Type must be 'Online' or 'In Person'";
        if (!capacity || !Number.isInteger(capacity)) errors.capacity = "Capacity must be an integer";
        if (!price || isNaN(price)) errors.price = "Price is invalid";
        if (!description) errors.description = "Description is required";
        if (!startDate || new Date(startDate) < new Date()) errors.startDate = "Start date must be in the future";
        if (!endDate || new Date(endDate) < new Date(startDate)) errors.endDate = "End date is less than start date";

        const event = await Event.findByPk(thisEventId);

        const venue = await Venue.findByPk(venueId)

        if (!venue) return res.status(400).json({"message": "Venue couldn't be found"})

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
        if (error instanceof Sequelize.ValidationError) {
            const errors = {};
            error.errors.forEach(({ path, message }) => {
                errors[path] = message;
            });

            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

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



        if (group.organizerId !== req.user.id || (!membership || membership.status !== 'co-host')) {
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

        const group = await Group.findByPk(event.groupId);

        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: req.user.id
            }
        });

        const attendance = await Attendence.findOne({
            where: {
                eventId,
                userId
            }
        });
        if (!attendance) {
            return res.status(404).json({ message: "Attendence does not exist for this User" });
        }
        // console.log('*******************************')
        // console.log('*******************************')
        // console.log('*******************************')
        // console.log('req.user.id',req.user.id)
        // console.log('event.organizerid',group.organizerId)
        // console.log('userId', userId)
        // console.log('Membership', membership)
        // console.log('Membership status', membership.status)

        if (req.user.id !== group.organizerId && req.user.id !== userId && (!membership || membership.status !== 'co-host')) {
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
