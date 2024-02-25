import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleGroup } from "../../../store/groups"
import {
    // deleteThisEvent,
    getSingleEvent,
    getAllEventsByGroupId,
} from '../../../store/events';
import { deleteGroup } from '../../../store/groups';
import { useModal } from '../../../context/Modal';
import './SingleGroup.css'
import ConfirmDelete from '../../ConfirmDeleteModal/ConfirmDelete';


export default function OneGroup() {
    const {groupid: id} = useParams()
    const group = useSelector(state => state.groups.groups[id])
    const user = useSelector(state => state.session.user)
    const events = useSelector(state => state.events.events.Events)
    console.log("🚀 ~ OneGroup ~ events:", events)

    const [eventDescriptions, setEventDescriptions] = useState({});

    console.log("🚀 ~ OneGroup ~ eventDescriptions:", eventDescriptions)


    const { setModalContent } = useModal();


// Setting the Date and Time
    //   const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 2);

    //   const options = { hour: '2-digit', minute: '2-digit' };
    //   const startTime = startDate.toLocaleTimeString('en-US', options);
    //   const startDateString = startDate.toLocaleDateString('en-US');

      const eventDatesAndTimes = events?.map((event, index) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + index);

        const endDate = new Date();
        endDate.setHours(endDate.getHours() + index);

        const options = { hour: '2-digit', minute: '2-digit' };
        const startTime = startDate.toLocaleTimeString('en-US', options);
        const startDateString = startDate.toLocaleDateString('en-US');

        return { startDateString, startTime };
    });
// This will be erased when actual times are in the events


    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getSingleGroup(id));
            const allEvents = await dispatch(getAllEventsByGroupId(id));

            if (allEvents && allEvents.Events) {
                const descriptions = {};
                for (let event of allEvents.Events) {
                    const eventDetails = await dispatch(getSingleEvent(event.id));
                    descriptions[eventDetails.id] = eventDetails.description;
                }
                setEventDescriptions(descriptions);
            }

            setIsLoading(false);
        }

        fetchData();
    }, [dispatch, id]);


    const groupPreviewImage = group?.GroupImages?.find(image => image.preview)


    const areYouMaster = () => {
        if (group && user){
            return group.organizerId === user.id ? true : false
        }
    }
    const hnadleCreateEvent = () => {
        navigate(`/groups/${id}/event/new`)
    }

    const handleEdit = () => {
        navigate(`/groups/${id}/edit`)
    }


    const handleGroupDelete = async () => {
        try {
            await dispatch(deleteGroup(group));
            setTimeout(() => {
                navigate('/groups');
            }, 500);
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    }

    const deleteModal = () => {
        setModalContent(<ConfirmDelete onDelete={handleGroupDelete} />);
      }


    return isLoading ? <div>Loading...</div> : (
    <div className='fullcontainer'>
        <div className='singlegroupcontainer'>
            <div className='singlegroupdetails'>

            <div className='backtogroup' onClick={() => navigate('/groups/')}>
                <span style={{marginRight: '8px'}} className='arrow'>{'<'}</span>
                <span className='group-text'>Groups</span>
            </div>


                <div className='singlegroup'>
                    <ul className='groupdetails'>

                        <li className='listofgroupdets' key={group?.id}>
                            <div className='groupimagesizingcontainer'>
                                {groupPreviewImage && <img className='groupimagesizing' src={groupPreviewImage.url} alt="Group" />}
                            </div>

                            <div className='groupinforcontainer'>
                                <div className='groupinfo'>
                                    <h1 style={{marginTop: '0px', marginBottom:'8px'}}>{group?.name}</h1>
                                    <p style={{marginTop: '0px'}}>{`${group?.city}, ${group?.state}`}</p>
                                    <p style={{marginTop: '0px'}}>{`${events?.length} events · ${group?.private ? 'Private' : 'Public'}`}</p>
                                    {group && <p style={{marginTop: '0px'}}> Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>}
                                </div>

                                <div className='actonbuttons-groups'>
                                    <div className='Idontknow'>
                                        {areYouMaster() ?
                                            <div>
                                                <button className='groupbuttons' onClick={hnadleCreateEvent}>
                                                    Create Event
                                                </button>

                                                <button className='groupbuttons' onClick={handleEdit}>
                                                    Update
                                                </button>

                                                <button className='groupbuttons' onClick={deleteModal}>
                                                    Delete
                                                </button>
                                            </div>
                                            :
                                            (user ?
                                                <div>
                                                    <button className='groupbuttons' onClick={() => alert("Feature coming soon!")}>
                                                        Join this group!
                                                    </button>
                                                </div>
                                                :
                                               null
                                            )
                                        }
                                    </div>
                                </div>

                            </div>
                        </li>
                    </ul>

                </div>

        </div>


                <div className='groupsandeventdetails-ingroup'>
                    <div className='eventandgroup-container'>
                        <div className='organizerbox'>
                            <h2>Organizer</h2>
                            <p style={{}}>{group?.Organizer.firstName} {group?.Organizer.lastName}</p>
                        </div>

                        <div className='About'>
                            <h2>What we&apos;re about</h2>
                            <p>{group?.about}</p>
                        </div>

                        <div className='event-box'>
                            <div>
                                {events?.length === 0 ?
                                    <h2 style={{ marginBottom: 0 }}>There&apos;s no events for this group yet!</h2>
                                    :
                                    <h2 style={{ marginBottom: 0 }}>Upcoming Events: ({events?.length})</h2>
                                }
                            </div>

                            {/* {events && events.map(event => ( */}
                                {events && events.map((event, index) => (
                                    <ul onClick={() => navigate(`/events/${event.id}`)} style={{paddingLeft:'0px', cursor:'pointer'}} key={event.id}>
                                        <li className='Full container'>
                                            <div className='singleEventContainer'>
                                                <div id='topBox'>
                                                    <div style={{width: '40%', marginRight:'10px'}}>
                                                        <img id='imageDiv-sg' src={event.previewImage} alt="Group" />
                                                    </div>

                                                    <div id='eventinfo-ingroup'>
                                                        <div id='eventdateandtime'>
                                                            {/* <p id='eventdateandtimep'>{`${event.startDate} * ${event.time}`}</p> */}
                                                            {/* <p style={{marginTop:'0'}}>{startDateString} · {startTime}</p> */}
                                                            <p style={{marginTop:'0'}}>{eventDatesAndTimes[index].startDateString} · {eventDatesAndTimes[index].startTime}</p>
                                                        </div>

                                                        <div id='eventnamecontainer'>
                                                            <p id='eventnamep'>{event.name}</p>
                                                        </div>
                                                        <div>
                                                            <p>{`${group?.city}, ${group?.state}`}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{display:'flex', justifyContent:'flex-start'}} id='bottomBox-eventDescription'>
                                                    <p style={{textAlign:'left'}}>{eventDescriptions[event.id]}</p>
                                                </div>


                                            </div>
                                        </li>

                                    </ul>
                                ))}
                        </div>

                    </div>
                </div>
        </div>
    </div>
    );
}
