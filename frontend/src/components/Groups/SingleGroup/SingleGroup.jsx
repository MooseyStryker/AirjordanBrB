import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteGroup, getSingleGroup } from "../../../store/groups"
import { deleteThisEvent, getAllEventsByGroupId } from '../../../store/events';
import './SingleGroup.css'

export default function OneGroup() {
    const {groupid: id} = useParams()
    const group = useSelector(state => state.groups.groups[id])
    const user = useSelector(state => state.session.user)
    const events = useSelector(state => state.events.events.Events)

    const navigate = useNavigate()
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getSingleGroup(id))
        dispatch(getAllEventsByGroupId(id))
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

    const handleEventDelete = (id) => {
        dispatch(deleteThisEvent(id))
    }


    return (
        <div>

            <div className='singlegroup'>
                <ul>
                    <li key={group?.id}>
                        {groupPreviewImage && <img src={groupPreviewImage.url} alt="Group" style={{ width: '50%', height: 'auto' }} />}
                        <div className='groupname'>
                            <h2>{group?.name}</h2>
                        </div>
                        <div>
                            <p>{`${group?.city}, ${group?.state}`}</p>
                            <p>{group?.type}</p>
                            <p>{group?.about}</p>
                            <p>{group?.numMembers} members</p>
                        </div>
                    </li>
                </ul>
                <div>
                    {areYouMaster() &&
                        <div>
                                <button className='groupbuttons' onClick={hnadleCreateEvent}>
                                    Create an Event!
                                </button>

                                <button className='groupbuttons' onClick={handleEdit}>
                                    Edit
                                </button>

                                <button className='groupbuttons' onClick={handleGroupDelete}>
                                    Delete
                                </button>
                        </div>
                    }
                </div>
            </div>



            <div>
                {events && events.map(event => (
                    <div className='singleEvent' key={event.id}>
                        <ul>
                            <li>
                             <img src={event.previewImage} alt="Group" style={{ width: '50%', height: 'auto' }} />
                                <div className='groupname'>
                                    <h2>{event.name}</h2>
                                </div>
                                <div>
                                    <p>{`${event.startDate}, ${event.endDate}`}</p>
                                    <p>${event.price}</p>
                                    <p>{event.description}</p>
                                    <p>{event.numAttending} Attending</p>
                                </div>
                            </li>
                        </ul>
                        <div>
                            {areYouMaster() &&
                                <div>
                                    <button onClick={() => handleEdit(event.id)}>
                                        Edit
                                    </button>

                                    <button onClick={() => handleEventDelete(event.id)}>
                                        Delete
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}
