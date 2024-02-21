import { useEffect } from 'react'
import {
    useNavigate,
    useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleEvent } from '../../../store/events';
import { deleteGroup, getSingleGroup } from '../../../store/groups';
// import './SingleGroup.css'

export default function OneEvent() {
    const {eventid: id} = useParams()


    const dispatch = useDispatch()
    const event = useSelector(state => state.events.events[id])
    const group = useSelector(state => state.groups.groups[event?.groupId])
    const user = useSelector(state => state.session.user)
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getSingleEvent(id))
        dispatch(getSingleGroup(event?.groupId))

    }, [dispatch, id, event?.groupId])

    const previewImage = event?.EventImages?.find(image => image.preview)

    const areYouMaster = () => {
        if (group && user){
            return group.organizerId === user.id ? true : false
        }
    }


    const handleEdit = () => {
        navigate(`/groups/${id}/edit`)
    }

    const handleDelete = () => {
        dispatch(deleteGroup(group))
        navigate(`/groups`)
    }


    return (
        <div>
            <div className='singleEvent'>
                <ul>
                    <li key={event?.id}>
                        {previewImage && <img src={previewImage.url} alt="Group" style={{ width: '50%', height: 'auto' }} />}
                        <div className='groupname'>
                            <h2>{event?.name}</h2>
                        </div>
                        <div>
                            <p>{`${event?.startDate}, ${event?.endDate}`}</p>
                            <p>${event?.price}</p>
                            <p>{event?.description}</p>
                            <p>{event?.numAttending} Attending</p>
                        </div>
                    </li>
                </ul>
                <div>
                    {areYouMaster() &&
                        <div>

                                <button onClick={handleEdit}>
                                    Edit
                                </button>

                                <button onClick={handleDelete}>
                                    Delete
                                </button>
                        </div>
                    }
                </div>
            </div>

            <div>

            </div>
        </div>
    );
}
