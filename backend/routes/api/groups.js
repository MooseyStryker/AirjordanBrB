const express = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const { restoreUser, requireAuth } = require('../../utils/auth');


const { User, Group, Membership, GroupImage, Venue, Event, EventImage, Attendence } = require('../../db/models');
const membership = require('../../db/models/membership');

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

        // If the group has images, find the first one with a url and set it as the preview image
        if (group.GroupImages && group.GroupImages.length > 0) {
            const image = group.GroupImages.find(img => img.url);

            if (image) {
                groupJSON.previewImage = image.url
            }
        }

        // Remove membership, groupimages properties
        delete groupJSON.Memberships;
        delete groupJSON.GroupImages;

        console.log(groupJSON)
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

        console.log(eventJSON)
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

        console.log(groupList)
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
        const groupList = processGroupData(group);
        // If groupList has one element in the array, return that element. If not, then return the entire array.
        return res.json(Array.isArray(groupList) && groupList.length === 1 ? groupList[0] : groupList);
    } else {
        res.status(404).json({
            message: "Group couldn't be found"
        });
    }
});



router.get('/:groupId/venues', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const { user } = req;
        console.log("This is it",groupId)

        if(!user){
            const err = new Error('Please login or sign up');
            err.status = 401;
            err.title = 'User authentication failed';
            return next(err);
        }

        const group = await Group.findByPk(groupId);
        if (group.organizerId !== req.user.id && Membership.status !== 'co-host') {
            return res.status(403).json({
                message: "You don't have permission to edit this group"
            });
        }



        const venues = await Venue.findAll({
            where: {
                groupId: groupId
            },
            attributes: ["id","groupId","address","city","state","lat","lng"]
        });

        if (venues.length === 0){
            return res.status(404).json({
                "message": "Group couldn't be found"
            })
        }



        res.json({
            Venues: venues
        })

    } catch (error) {
        next(error)
    }


});

router.get('/:groupId/events', async (req, res, next) => {
    try{
        const thisgroupId = req.params.groupId

        const group = await Group.findByPk(thisgroupId);

        if(!group) return res.status(403).json({"message": "Group couldn't be found"})

        const events = await Event.findAll({
            where: {
                groupId: thisgroupId
            },
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
            ]
        });

        // Extra error, pprobably not needed
        // if(events.length === 0) return res.status(403).json({"message": "This group doesn't have an event"})



        if(events) {
            const eventList = processEventList(events);
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
        const thisGroupId = req.params.groupId;
        const { user } = req;


        if(!user){
            const err = new Error('Please login or sign up');
            err.status = 401;
            err.title = 'User authentication failed';
            return next(err);
        }


        const group = await Group.findByPk(thisGroupId);


        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }


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



        if ( membership.status !== 'co-host' || group.organizerId !== req.user.id) {
            res.json({ Members: formattedMembers });
        } else {
            const nonPendingMembers = formattedMembers.filter(member => member.Membership.status !== 'pending');
            res.json({ Members: nonPendingMembers });
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

// Issue with error not giving the right order of errors
router.post('/:groupId/images', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const { url, preview } = req.body

        const group = await Group.findByPk(groupId)

        if(!group) return res.status(403).json({"message": "Group couldn't be found"})

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

router.post('/:groupId/venues', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const { address, city, state, lat, lng } = req.body

        const group = await Group.findByPk(groupId)

        if(!group) return res.status(403).json({"message": "Group couldn't be found"})

        if (group.organizerId !== req.user.id && Membership.status !== 'co-host') {
            return res.status(403).json({
                message: "You don't have permission to create this venue"
            });
        }

        const venue = await Venue.create({
            groupId: groupId,
            address,
            city,
            state,
            lat,
            lng
        })

        res.json({
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng
        })
    } catch (error) {
        next(error);
    }
})




router.post('/:groupId/events', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const thisGroupId = req.params.groupId;
        const { groupId, venueId, name, type, capacity, price, description, startDate, endDate } = req.body

        const group = await Group.findByPk(thisGroupId)


        if(!group) return res.status(403).json({"message": "Group couldn't be found"})

        if (group.organizerId !== req.user.id && Membership.status !== 'co-host') {
            return res.status(403).json({
                message: "You don't have permission to create this events"
            });
        }

        const event = await Event.create({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });

        res.json({
            groupId: thisGroupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        })
    } catch (error) {
        next(error);
    }
})

router.post('/:groupId/memberships', restoreUser, requireAuth, async (req, res) => {
    try {

        const thisGroupId = req.params.groupId
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
                groupId: group.id,
                userId: req.user.id,
                status: 'pending'
        });
        res.status(200).json({
            memberId: newMembership.id,
            status: newMembership.status
        });

    } catch (err) {
        console.error('Error: ', err);
    }
  });








/*  DELETE   */
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




/*       PUT      */


router.put('/:groupId', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
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

        await group.save();

        res.json(group)


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
    }
})










module.exports = router;
