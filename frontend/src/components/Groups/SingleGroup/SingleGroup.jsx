import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteGroup, getSingleGroup } from "../../../store/groups"
import {
    // deleteThisEvent,
    getAllEventsByGroupId } from '../../../store/events';
import './SingleGroup.css'

export default function OneGroup() {
    const {groupid: id} = useParams()
    const group = useSelector(state => state.groups.groups[id])
    const user = useSelector(state => state.session.user)
    const events = useSelector(state => state.events.events.Events)
    console.log("🚀 ~ OneGroup ~ events:", events)


    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getSingleGroup(id))
            await dispatch(getAllEventsByGroupId(id))

            setIsLoading(false)
        }

        fetchData()
    }, [dispatch, id, events?.groupId])



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

    const handleGroupDelete = () => {
        dispatch(deleteGroup(group))
        navigate(`/groups`)
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
                        <li key={group?.id}>
                            {groupPreviewImage && <img className='groupimagesizing' src={groupPreviewImage.url} alt="Group" />}
                            <div className='groupinforcontainer'>
                                <div className='groupinfo'>
                                    <h2 style={{marginTop: '0px'}}>{group?.name}</h2>
                                    <p>{`${group?.city}, ${group?.state}`}</p>
                                    <p>{group?.type}</p>
                                    <p>{group?.numMembers} members</p>
                                    <p>{`${events?.length} events * ${group?.private ? 'Private' : 'Public'}`}</p>
                                    {group && <p> Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>}
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

                                            <button className='groupbuttons' onClick={handleGroupDelete}>
                                                Delete
                                            </button>
                                        </div>
                                        :
                                        <div>
                                            <button className='groupbuttons' onClick={() => alert("Feature coming soon!")}>
                                                Join this group!
                                            </button>
                                        </div>

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
                                {events?.length === 0 ? <h2>There&apos;s no events for this group yet!</h2> : <h2>Upcoming Events: {events?.length}</h2>}

                            </div>
                                {events && events.map(event => (
                                    <ul onClick={() => navigate(`/events/${event.id}`)} style={{paddingLeft:'0px', cursor:'pointer'}} key={event.id}>
                                        <li className='Full container'>
                                            <div className='singleEventContainer'>
                                                <div id='topBox'>
                                                    <div style={{width: '40%', marginRight:'10px'}}>
                                                        <img id='imageDiv-sg' src={event.previewImage} alt="Group" />
                                                    </div>

                                                    <div id='eventinfo-ingroup'>
                                                        <div id='eventdateandtime'>
                                                            <p id='eventdateandtimep'>{`${event.startDate}`}</p>
                                                        </div>

                                                        <div id='eventnamecontainer'>
                                                            <p id='eventnamep'>{event.name}</p>
                                                        </div>
                                                        <div>
                                                            <p>{event.description}</p>
                                                            <p>{`${group?.city}, ${group?.state}`}</p>
                                                        </div>
                                                    </div>
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
