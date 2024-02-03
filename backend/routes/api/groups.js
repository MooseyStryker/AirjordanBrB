const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const moment = require('moment');

const { restoreUser, requireAuth } = require('../../utils/auth');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');

const router = express.Router();

// Helper funcs

const processGroupData = (groupData) => {
    const ensuresThisIsAnArray = Array.isArray(groupData) ? groupData : [groupData]; // Converts findByPk and findOne to array

    const groupList = ensuresThisIsAnArray.map(group => {

        const groupJSON = group.toJSON();
        // If the group has memberships, counth them, if not set the count to 0.
        if (group.Memberships){
            groupJSON.numMembers = group.Memberships.length;
        } else {
            groupJSON.numMembers = 0;
        }

        // If the group has images, find the first one with a url and set it as the preview image.
        // This is changed to also look at the preview, and if it is false it'll fill out null
        if (group.GroupImages && group.GroupImages.length > 0) {
            const image = group.GroupImages.find(img => img.url && img.preview !== false);

            if (image) {
                groupJSON.previewImage = image.url;
            } else {
                groupJSON.previewImage = null;
            }
        }

        groupJSON.createdAt = moment(group.createdAt).format('YYYY-MM-DD HH:mm:ss');
        groupJSON.updatedAt = moment(group.updatedAt).format('YYYY-MM-DD HH:mm:ss');

        // Remove membership, groupimages properties
        delete groupJSON.Memberships;
        delete groupJSON.GroupImages;


        return groupJSON
    })
    return groupList
}


const processEventList = (EventList) => {
    const ensuresThisIsAnArray = Array.isArray(EventList) ? EventList : [EventList]; // Converts findByPk and findOne to array

    const eventList = ensuresThisIsAnArray.map(event => {

        const eventJSON = event.toJSON();
        // If the event has attendences, counth them, if not set the count to 0.
        if (event.Attendences){
            eventJSON.numAttending = event.Attendences.length;
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
        delete eventJSON.Attendences;
        delete eventJSON.EventImages;


        return eventJSON
    })
    return eventList
}


router.get('/', async (req, res, next) => {
    try {
        const groupData = await Group.findAll({
            include: [
                { model: Membership },
                { model: GroupImage }
            ]
        });


        const groupList = processGroupData(groupData);

        res.json({
            'Groups': groupList
        })
    } catch (error) {
        next(error);
    }

});


router.get('/current', restoreUser, requireAuth, async (req, res, next) => {

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
        },
        { model: GroupImage }
    ]
    });

    const groupList = processGroupData(groupData);

    res.json({
        Groups: groupList
    })
});


router.get('/:groupId', async (req, res) => {
    let groupId = req.params.groupId;
    groupId = +groupId;

    const group = await Group.findByPk(groupId, {
        include: [
            GroupImage,
            {
                model: User,
                as: 'Organizer',
                attributes:['id', 'firstName', 'lastName']
            },
            Venue,
            Membership
        ]
    });

    const getDetailsOfGroupById = (groupData) => {
        const ensuresThisIsAnArray = Array.isArray(groupData) ? groupData : [groupData];

        const groupList = ensuresThisIsAnArray.map(group => {

            const groupJSON = group.toJSON();

            if (group.Memberships){
                groupJSON.numMembers = group.Memberships.length;
            } else {
                groupJSON.numMembers = 0;
            }

            if (group.GroupImages && group.GroupImages.length > 0) {
                const image = group.GroupImages.find(img => img.url);

                if (image) {
                    groupJSON.previewImage = image.url
                }
            }


            groupJSON.GroupImages = group.GroupImages.map(image => {
                const { groupId, createdAt, updatedAt, ...imageWithoutTimestamps } = image.toJSON();
                return imageWithoutTimestamps;
            });


            delete groupJSON.Memberships;

            delete groupJSON.previewImage;

            groupJSON.createdAt = moment(groupJSON.createdAt).format('YYYY-MM-DD HH:mm:ss');
            groupJSON.updatedAt = moment(groupJSON.updatedAt).format('YYYY-MM-DD HH:mm:ss');

            if (groupJSON.Venues) {
                groupJSON.Venues.forEach(venue => {
                    delete venue.createdAt;
                    delete venue.updatedAt;
                    venue.lat = parseFloat(venue.lat)
                    venue.lng = parseFloat(venue.lng)
                });
            }

            (groupJSON)
            return groupJSON
        })
        return groupList

    }

    if (group) {
        const groupList = getDetailsOfGroupById(group);


        return res.json(Array.isArray(groupList) && groupList.length === 1 ? groupList[0] : groupList);
    } else {
        res.status(404).json({
            message: "Group couldn't be found"
        });
    }
});


router.get('/:groupId/venues', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        groupId = +groupId

        const { user } = req;


        if(!user){
            const err = new Error('Please login or sign up');
            err.status = 401;
            err.title = 'User authentication failed';
            return next(err);
        }

        const group = await Group.findByPk(groupId);
        if(!group) return res.status(404).json({"message": "Group couldn't be found"})

        if (group.organizerId === req.user.id){
            const venues = await Venue.findAll({
                where: {
                    groupId: groupId
                },
                attributes: ["id","groupId","address","city","state","lat","lng"]
            });

            return res.json({
                Venues: venues
            })
        }

        const membership = await Membership.findOne({
            where:{
                userId: req.user.id,
                groupId: groupId
            }
        })
        if(!membership) return res.status(403).json({"message": "Your membership to this group couldn't be found"})

        if (!(group.organizerId === req.user.id || membership.status === 'co-host')) {
            return res.status(403).json({
                message: "You don't have permission to see this venue"
            });
        }



        const venues = await Venue.findAll({
            where: {
                groupId: groupId
            },
            attributes: ["id","groupId","address","city","state","lat","lng"]
        });

        venues.forEach(venue => {
            venue.lat = parseFloat(venue.lat)
            venue.lng = parseFloat(venue.lng)
        });

        res.json({
            Venues: venues
        })

    } catch (error) {
        next(error)
    }


});


router.get('/:groupId/events', async (req, res, next) => {
    try{
        let thisgroupId = req.params.groupId
        thisgroupId = +thisgroupId

        const group = await Group.findByPk(thisgroupId);

        if(!group) return res.status(404).json({"message": "Group couldn't be found"})


        const events = await Event.findAll({
            where: {
                groupId: thisgroupId
            },
            include:[
                {model: Attendence},
                {model: EventImage},
                {
                    model: Group,
                    attributes: ['id','name','city','state'],
                    include: [
                        {
                            model:Venue,
                            attributes:['id', 'city', 'state']
                        }
                    ]
                }
            ]
        });

        const thisReordersProperly= (EventList) => {
            const ensuresThisIsAnArray = Array.isArray(EventList) ? EventList : [EventList]; // Converts findByPk and findOne to array

            const eventList = ensuresThisIsAnArray.map(event => {

                const eventJSON = event.toJSON();

                if (event.Attendences){
                    eventJSON.numAttending = event.Attendences.length;
                } else {
                    eventJSON.numAttending = 0;
                }

                if (event.EventImages && event.EventImages.length > 0) {
                    const image = event.EventImages.find(img => img.url && img.preview !== false);

                    if (image) {
                        eventJSON.previewImage = image.url
                    } else {
                        eventJSON.previewImage = null;
                    }
                }

                if (event.Group.Venues && event.Group.Venues.length > 0) {
                    eventJSON.Venue = event.Group.Venues[0];
                } else {
                    eventJSON.Venue = null;
                }

                eventJSON.startDate = moment(event.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                eventJSON.endDate = moment(event.updatedAt).format('YYYY-MM-DD HH:mm:ss');

                delete eventJSON.Attendences;
                delete eventJSON.EventImages;
                delete eventJSON.Group.Venues;

                // Reorder the properties cause this one is being a butt
                const reorderedEvent = {
                    id: eventJSON.id,
                    groupId: eventJSON.groupId,
                    venueId: eventJSON.venueId,
                    name: eventJSON.name,
                    type: eventJSON.type,
                    startDate: eventJSON.startDate,
                    endDate: eventJSON.endDate,
                    numAttending: eventJSON.numAttending,
                    previewImage: eventJSON.previewImage,
                    Group: eventJSON.Group,
                    Venue: eventJSON.Venue
                };

                (reorderedEvent)
                return reorderedEvent
            })
            return eventList
        }

        if(events) {
            const eventList = thisReordersProperly(events);
            res.json({Events: eventList})
        } else {
            res.status(404).json({
                message: "Group couldn't be found"
            });
        }
    } catch (error){
        next(error)
    }
});


router.get('/:groupId/members', async (req, res, next) => {
    try {
        let thisGroupId = req.params.groupId;
        thisGroupId = +thisGroupId;


        const group = await Group.findByPk(thisGroupId);
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }
        if (group.organizerId === req.user.id) {

            const members = await Membership.findAll({
                where: { groupId: thisGroupId },
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            });

            const formattedMembers = members.map(member => ({
                id: member.User.id,
                firstName: member.User.firstName,
                lastName: member.User.lastName,
                Membership: {
                    status: member.status
                }
            }));

            return res.json({ Members: formattedMembers });
        }




        const membership = await Membership.findOne({
            where: {
                userId: req.user.id,
                groupId: thisGroupId
            }
        })




        const members = await Membership.findAll({
            where: { groupId: thisGroupId },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });


        const formattedMembers = members.map(member => ({
            id: member.User.id,
            firstName: member.User.firstName,
            lastName: member.User.lastName,
            Membership: {
                status: member.status
            }
        }));


        if(!membership || membership.status !== 'co-host') {
            const nonPendingMembers = formattedMembers.filter(member => member.Membership.status !== 'pending');
            res.json({ Members: nonPendingMembers });
        } else {
            res.json({ Members: formattedMembers });
        }

    } catch (error) {
        next(error);
    }
});















/* POST */

router.post('/', restoreUser, requireAuth, async (req, res, next) => {
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

        const newGroupJSON = newGroup.toJSON();


        newGroupJSON.createdAt = moment(newGroup.createdAt).format('YYYY-MM-DD HH:mm:ss');
        newGroupJSON.updatedAt = moment(newGroup.updatedAt).format('YYYY-MM-DD HH:mm:ss');

        res.status(201).json(newGroupJSON)
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


router.post('/:groupId/images', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        groupId = +groupId;
        const { url, preview } = req.body

        const group = await Group.findByPk(groupId)

        if(!group) return res.status(404).json({"message": "Group couldn't be found"})

        if (group.organizerId !== req.user.id) {
            return res.status(403).json({
                message: "You don't have permission to add an image to this group"
            });
        }

        const image = await GroupImage.create({
            groupId: groupId,
            url,
            preview
        })

        res.json({
            id: image.id,
            url: image.url,
            preview: image.preview
        })
    } catch (error) {
        if(error instanceof Sequelize.ValidationError) {

            return res.status(400).json({
                message: 'Validation Error',
                errors: error.errors.map(e => {
                  (e);
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

router.post('/:groupId/venues', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let thisGroupId = req.params.groupId;
        thisGroupId = +thisGroupId;
        const { address, city, state, lat, lng } = req.body

        const group = await Group.findByPk(thisGroupId)
        if(!group) return res.status(404).json({"message": "Group couldn't be found"})


        if (group.organizerId === req.user.id) {
            const venue = await Venue.create({
                groupId: thisGroupId,
                address,
                city,
                state,
                lat,
                lng
            })

            return res.json({
                id: venue.id,
                groupId: thisGroupId,
                address: venue.address,
                city: venue.city,
                state: venue.state,
                // lat: venue.lat,
                // lng: venue.lng
                lat: parseFloat(venue.lat),
                lng: parseFloat(venue.lng)
            })
        }

        const membership = await Membership.findOne({
            where:{
                userId: req.user.id,
                groupId: thisGroupId
            }
        })
        if(!membership) return res.status(403).json({"message": "Your membership to this group couldn't be found"})



        if (!(group.organizerId === req.user.id || membership.status === 'co-host')) {
            return res.status(403).json({
                message: "You don't have permission to create this venue"
            });
        }

        const venue = await Venue.create({
            groupId: thisGroupId,
            address,
            city,
            state,
            lat,
            lng
        })

        res.json({
            id: venue.id,
            groupId: thisGroupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            // lat: venue.lat,
            // lng: venue.lng
            lat: parseFloat(venue.lat),
            lng: parseFloat(venue.lng)
        })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});

            res.status(400).json({
                message: 'Bad Request',
                errors
            });
        } else {
            next(error);
        }
    }

})


router.post('/:groupId/events', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let thisGroupId = req.params.groupId;
        thisGroupId = +thisGroupId

        let { groupId, venueId, name, type, capacity, price, description, startDate, endDate } = req.body

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

        const group = await Group.findByPk(thisGroupId)
        if(!group) return res.status(404).json({"message": "Group couldn't be found"})

        const venue = await Venue.findByPk(venueId)
        if (!venue) return res.status(404).json({"message": "Venue couldn't be found"})

        if (group.organizerId === req.user.id) {
            const event = await Event.create({
                groupId: thisGroupId,
                venueId: venue.id,
                name,
                type,
                capacity,
                price,
                description,
                startDate,
                endDate
            });

            startDate = moment(event.startDate).format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(event.endDate).format('YYYY-MM-DD HH:mm:ss');

            return res.json({
                id: event.id,
                groupId: thisGroupId,
                venueId: venue.id,
                name: event.name,
                type: event.type,
                capacity: parseInt(event.capacity),
                price: parseFloat(event.price),
                description: event.description,
                startDate,
                endDate
            })
        }


        const membership = await Membership.findOne({
            where:{
                userId: req.user.id,
                groupId: thisGroupId
            }
        })
        if(!membership) return res.status(403).json({"message": "Your membership to this group couldn't be found"})


        if (!(group.organizerId === req.user.id || membership.status === 'co-host')) {
            return res.status(403).json({
                message: "You don't have permission to create this events"
            });
        }


        const event = await Event.create({
            groupId: thisGroupId,
            venueId: venue.id,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });

        startDate = moment(event.startDate).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(event.endDate).format('YYYY-MM-DD HH:mm:ss');

        return res.json({
            id: event.id,
            groupId: thisGroupId,
            venueId: venue.id,
            name: event.name,
            type: event.type,
            capacity: parseInt(event.capacity),
            price: parseFloat(event.price),
            description: event.description,
            startDate,
            endDate
        })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});


            res.status(400).json({
                message: 'Bad Request',
                errors
            });
        } else {
            next(error);
        }
    }
});


router.post('/:groupId/membership', restoreUser, requireAuth, async (req, res) => {
    try {

        let thisGroupId = req.params.groupId
        thisGroupId = +thisGroupId;

        const group = await Group.findByPk(thisGroupId)

        if (!group) {
            return res.status(404).json(
                {
                    message: "Group couldn't be found"
            });
        }

        const existingMembership = await Membership.findOne({
            where:{
                groupId: group.id,
                userId: req.user.id
            }
        });

        if (existingMembership) {
            if (existingMembership.status === 'pending') {
            return res.status(400).json({
                message: 'Membership has already been requested'
            });
            } else if (
                existingMembership.status === 'member'
                || existingMembership.status === 'co-host'
            ){
            return res.status(400).json({
                message: 'User is already a member of the group'
            });
            }
        }

        const newMembership = await Membership.create(
            {
                userId: req.user.id,
                groupId: thisGroupId,
                status: 'pending'
        });
        res.status(200).json({
            memberId: newMembership.userId,
            status: newMembership.status
        });

    } catch (err) {
        console.error('Error: ', err);
    }
  });








/*  DELETE   */
router.delete('/:groupId', restoreUser, requireAuth, async (req, res) => {
    let thisGroupId = req.params.groupId
    thisGroupId = +thisGroupId;

    const groupDelete = await Group.findByPk(thisGroupId)
    const group = await Group.findByPk(thisGroupId);

    if(!groupDelete) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    if (group.organizerId !== req.user.id) {
        return res.status(403).json({
            message: "You don't have permission to delete this group"
        });
    }


    groupDelete.destroy();

    res.json({
        'message': "Successfully deleted"
    })
})



router.delete('/:groupId/membership/:memberId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const { groupId, memberId } = req.params;

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }


        const user = await User.findByPk(memberId);

        if (!user) {
            return res.status(404).json({ message: "User couldn't be found" });
        }

        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            }
        });



        if (!membership) {
            return res.status(404).json({ message: "Membership does not exist for this User" });
        }
        if (req.user.id !== user.id && group.organizerId !== req.user.id) {
            return res.status(403).json({ message: "You don't have permission to delete this membership" });
        }

        await membership.destroy();

        res.status(200).json({ message: "Successfully deleted membership from group" });

    } catch (err) {
        console.error('Error: ', err);
        next(err);
    }
});








/*       PUT      */
router.put('/:groupId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let groupId = req.params.groupId;
        groupId = +groupId;

        const { name, about, type, private, city, state } = req.body

        const group = await Group.findByPk(groupId);

        if(!group){
            return res.status(404).json({
                message: "Group couldn't be found"
            })
        }

        if (group.organizerId !== req.user.id) {
            return res.status(403).json({
                message: "You don't have permission to edit this group"
            });
        }

        group.name = name !== undefined ? name : group.name;
        group.about = about !== undefined ? about : group.about;
        group.type = type !== undefined ? type : group.type;
        group.private = private !== undefined ? private : group.private;
        group.city = city !== undefined ? city : group.city;
        group.state = state !== undefined ? state : group.state;


        const groupJSON = group.toJSON();

        groupJSON.createdAt = moment(group.createdAt).format('YYYY-MM-DD HH:mm:ss');
        groupJSON.updatedAt = moment(group.updatedAt).format('YYYY-MM-DD HH:mm:ss');

        await group.save();

        res.json(groupJSON)


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


router.put('/:groupId/membership', restoreUser, requireAuth, async (req, res, next) => {
    try {
        let { memberId, status } = req.body
        let thisGroupId = req.params.groupId
        thisGroupId = +thisGroupId;

        const group = await Group.findByPk(thisGroupId)
        if (!group) {
            return res.status(404).json({
                message: "Group couldn't be found"
            });
        }

        const findUser = await Membership.findByPk(memberId)
        if (!findUser) {
            return res.status(404).json({
                message: "User couldn't be found"
            });
        }


        const existingMembership = await Membership.findOne({
            where:{
                groupId: group.id,
                userId: memberId
            }
        });
        if(!existingMembership) {
            return res.status(404).json({
                message: "Membership between the user and the group does not exist"
            });
        }


        const currentUserMembership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: req.user.id
            }
        })

        if (!currentUserMembership && req.user.id !== group.organizerId) {
            return res.status(403).json({
                message: "You don't have a membership with this group"
            });
        }




        if (status === 'pending'){
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    status: 'Cannot change a membership status to pending'
                }
            })
        }

        if (['member', 'co-host'].indexOf(status) === -1) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }


        if (group.organizerId !== req.user.id || (currentUserMembership && currentUserMembership.status !== 'co-host')) {
            return res.status(403).json({
                message: "You don't have permission to change this membership status"
            });
        } else if (existingMembership.status === 'member' && group.organizerId !== req.user.id) {
            return res.status(403).json({
                message: "You don't have permission to change this membership status"
            });
        }

        else {
            existingMembership.status = req.body.status;
            await existingMembership.save();
            return res.status(200).json({
                id: existingMembership.id,
                groupId: group.id,
                memberId: memberId,
                status: existingMembership.status
            })
        };
    } catch (err) {
        console.error('Error: ', err);
        next(err)
    }
});





module.exports = router;
