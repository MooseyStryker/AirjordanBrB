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


        delete eventJSON.description;
        delete eventJSON.price;
        delete eventJSON.capacity;
        delete eventJSON.Attendences;
        delete eventJSON.EventImages;


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
        if (name) isWhere.name = { [Op.substring]: `%${name}%` };
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
        let thisEventId = req.params.eventId
        thisEventId = +thisEventId

        const event = await Event.findByPk(thisEventId, {
            include:[
                {model: Attendence},
                {model: EventImage.scope('basicInfo')},
                {
                    model:Venue,
                    attributes:['id', 'address', 'city', 'state', 'lat', 'lng']
                },
                {
                    model: Group,
                    attributes: ['id','name','city','state','private']
                },
            ]
        });


        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        // Needs to keep EventImages
        const processEventKeepImages = (event) => {
            const eventJSON = event.toJSON();
            eventJSON.numAttending = event.Attendences ? event.Attendences.length : 0;
            if (event.EventImages && event.EventImages.length > 0) {
                const image = event.EventImages.find(img => img.url);
                if (image) {
                    eventJSON.previewImage = image.url
                }
            }
            eventJSON.Venue = event.Venue ? event.Venue : [];
            delete eventJSON.Attendences;
            // delete eventJSON.Group.Venues;
            delete eventJSON.previewImage;
            return eventJSON;
        }

        const processedEvent = processEventKeepImages(event);
        res.json(processedEvent);
    } catch (error){
        next(error)
    }
});



router.get('/:eventId/attendees', async (req, res, next) => {
    try {
        let thisEventId = req.params.eventId;
        thisEventId = +thisEventId;
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

// router.post('/:eventId/images', restoreUser, requireAuth, async (req, res, next) => {
//     try{

//         let thisEventId = req.params.eventId;
//         thisEventId = +thisEventId
//         const{ url, preview } = req.body;

//         const event = await Event.findByPk(thisEventId);
//         if(!event || event.groupId === null) return res.status(404).json({"message": "Event couldn't be found"})


//         const group = await Group.findByPk(event.groupId);
//         if(!group){
//             return res.status(404).json({"message": "Group couldn't be found"})
//         }
//         if (group.organizerId === req.user.id){
//             const image = await EventImage.create({
//                 eventId: thisEventId,
//                 url,
//                 preview
//             })

//             return res.json({
//                 id: image.id,
//                 url: image.url,
//                 preview: image.preview
//             })
//         }

//         const attend = await Attendence.findOne({
//             where: {
//                 eventId: thisEventId,
//                 userId: req.user.id
//             }
//         })
//         if(!attend){
//             return res.status(403).json({"message": "You must be attending this event to share images"})
//         }
//         if (attend.status === 'attending') {
//             const image = await EventImage.create({
//                 eventId: thisEventId,
//                 url,
//                 preview
//             })

//             return res.json({
//                 id: image.id,
//                 url: image.url,
//                 preview: image.preview
//             })
//         }

//         const membership = await Membership.findOne({
//             where: {
//                 userId: req.user.id,
//                 groupId: event.groupId
//             }
//         });
//         if(!membership){
//             return res.status(404).json({"message": "Membership couldn't be found"})
//         }
//         if (membership.status === 'co-host'){
//             const image = await EventImage.create({
//                 eventId: thisEventId,
//                 url,
//                 preview
//             })

//             return res.json({
//                 id: image.id,
//                 url: image.url,
//                 preview: image.preview
//             })
//         }



//         if (group.organizerId !== req.user.id
//             && (!membership || (membership.status !== 'co-host'
//             && attend.status !== 'attending'))
//         ) {
//             return res.status(403).json({
//                 message: "You don't have permission to add an image to this event"
//             });
//         }

//         const image = await EventImage.create({
//             eventId: thisEventId,
//             url,
//             preview
//         })

//         res.json({
//             id: image.id,
//             url: image.url,
//             preview: image.preview
//         })

//     } catch (e) {
//         next(e)
//     }
// })


router.post('/:eventId/images', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let thisEventId = req.params.eventId;
        thisEventId = +thisEventId;
        const { url, preview } = req.body;

        const event = await Event.findByPk(thisEventId);
        if (!event) return res.status(404).json({ "message": "Event couldn't be found" });

        const group = await Group.findByPk(event.groupId);
        if (!group) return res.status(404).json({ "message": "Group couldn't be found" });

        const membership = await Membership.findOne({
            where: {
                userId: req.user.id,
                groupId: event.groupId
            }
        });

        const attend = await Attendence.findOne({
            where: {
                eventId: thisEventId,
                userId: req.user.id
            }
        });

       if   (
                group.organizerId === req.user.id
                || (membership && membership.status === 'co-host')
                || (attend && attend.status === 'attending')
            ){

            const image = await EventImage.create({
                eventId: thisEventId,
                url,
                preview
            })

            return res.json({
                id: image.id,
                url: image.url,
                preview: image.preview
            });
       }

       return res.status(403).json({ message: "You don't have permission to add an image to this event" });
    } catch (e) {
      next(e)
    }
});



router.post('/:eventId/attendance', requireAuth, restoreUser, async (req, res, next) => {
    try {
        let thisEventId = req.params.eventId;
        thisEventId = +thisEventId;

        let userId = req.user.id;
        userId = +userId

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
        if(!membership) return res.status(403).json({"message": "Your membership to this group couldn't be found"})


        if (membership.status === 'pending'){
            return res.status(403).json({ message: "You need to have your pending membership accepted by a member, co-host, or the organizer" });
        }


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
        let thisEventId = req.params.eventId;
        thisEventId = +thisEventId;
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const errors = {};
        if (!name || name.length < 5) errors.name = "Name must be at least 5 characters";
        if (!type || (type !== 'Online' && type !== 'In person')) errors.type = "Type must be 'Online' or 'In Person'";
        if (!capacity || !Number.isInteger(capacity)) errors.capacity = "Capacity must be an integer";
        if (!price || isNaN(price) || (price < 0)) errors.price = "Price is invalid";
        if (!description) errors.description = "Description is required";
        if (!startDate || new Date(startDate).getTime() < new Date().getTime()) errors.startDate = "Start date must be in the future";
        if (!endDate || new Date(endDate).getTime() < new Date(startDate).getTime()) errors.endDate = "End date is less than start date";

        if(Object.keys(errors).length >= 1) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            })
        }


        const event = await Event.findByPk(thisEventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        const venue = await Venue.findByPk(venueId)
        if (!venue) return res.status(404).json({"message": "Venue couldn't be found"})



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
            endDate
        });


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
        let { eventId } = req.params;
        eventId = +eventId;

        const { userId, status } = req.body;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }

        const group = await Group.findByPk(event.groupId)


        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User couldn't be found" });
        }


        const attendance = await Attendence.findOne({
            where: {
                eventId,
                userId
            }
        })


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


        if (req.user.id !== group.organizerId && (!membership || membership.status !== 'co-host')) {
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
        let thisEventId = req.params.eventId;
        thisEventId = +thisEventId;

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



        if (
            group.organizerId !== req.user.id
            && (!membership || membership.status !== 'co-host')
        ) {
            return res.status(403).json({
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


        if (!(req.user.id == userId || req.user.id == group.organizerId)) {
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
