import { useEffect } from 'react'
import {
    useNavigate,
    useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleEvent } from '../../../store/events';
import { deleteGroup, getSingleGroup } from '../../../store/groups';
import './GetSingleEvent.css'


export default function OneEvent() {
    const {eventid: id} = useParams()


    const dispatch = useDispatch()
    const event = useSelector(state => state.events.events[id])
    console.log("🚀 ~ OneEvent ~ event:", event)
    const group = useSelector(state => state.groups.groups[event?.groupId])
    console.log("🚀 ~ OneEvent ~ group:", group)
    const user = useSelector(state => state.session.user)
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getSingleEvent(id))
        dispatch(getSingleGroup(event?.groupId))

    }, [dispatch, id, event?.groupId])

    const previewImage = event?.EventImages?.find(image => image.preview)
    const groupPreviewImage = group?.GroupImages?.find(image => image.preview)

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
        <div className='fullEventContainer'>
            <div className='topBarContainerplease'>

                <div className='topBar-singleEvent'>
                    <div className='backtogroup' onClick={() => navigate('/groups/')}>
                        <span style={{marginRight: '8px'}} className='arrow'>{'<'}</span>
                        <span className='group-text'>Events</span>
                    </div>
                    <div>
                        <h2 style={{marginTop:'15px', marginBottom:'0'}}>{event?.name}</h2>
                    </div>
                    <div>
                        <p style={{color:'silver'}}>Hosted by {group?.Organizer.firstName} {group?.Organizer.lastName}</p>
                    </div>
                </div>

            </div>


        <div className='bottomBar-singleEvent'>
            <div className='insideBottomBar'>

                <div className='singleEventContents'>
                        <ul className='eventDetails-singleEvent'>
                            <li  key={event?.id}>

                                <div className='previewImageEventContainer'>
                                    {previewImage && <img src={previewImage.url} alt="Group"
                                    />}
                                </div>

                                <div className='Event-details-container'>

                                    <div className='firstBox-groupNameimage'>
                                        <div style={{marginRight:'10px'}} className='groupImageforsomereason'>
                                            {groupPreviewImage && <img style={{width:'100%'}} className='groupimagesizing' src={groupPreviewImage.url} alt="Group" />}
                                        </div>
                                        <div>
                                            <div>
                                                <h5>{group?.name}</h5>
                                            </div>
                                            <div>
                                                {group?.private === false ? <h6 style={{color:'silver'}}>Public</h6> : <h6 style={{color:'silver'}}>Private</h6>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='secondBox-eventDetails'>
                                        <p>{`START ${event?.startDate}`}</p>
                                        <p>END {event?.endDate}</p>
                                        {event?.price === 0 ? <p>FREE</p> : <p>${event?.price}</p>}
                                    </div>

                                </div>

                            </li>
                        </ul>
                                        <p>{event?.description}</p>


                </div>
            </div>

        </div>


            <div>

            </div>
        </div>
    );
}
