import { useEffect } from 'react'
import {
    useNavigate,
    useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleEvent } from '../../../store/events';
import { getSingleGroup } from '../../../store/groups';
import { deleteThisEvent } from '../../../store/events';
import { useModal } from '../../../context/Modal';
import ConfirmDelete from '../../ConfirmDeleteModal/ConfirmDelete';

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

    const { setModalContent } = useModal();


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

    const handleEventDelete = () => {
        dispatch(deleteThisEvent(id))
        navigate(`/groups/${group.id}`)
    }

    const deleteModal = () => {
        setModalContent(<ConfirmDelete onDelete={handleEventDelete} />);
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

                                    <div onClick={() => navigate(`/groups/${group.id}`)} className='firstBox-groupNameimage'>
                                        <div style={{marginRight:'10px'}} className='groupImageforsomereason'>
                                            {groupPreviewImage && <img style={{width:'100%'}} className='groupimagesizing' src={groupPreviewImage.url} alt="Group" />}
                                        </div>
                                        <div>
                                            <div>
                                                <h3>{group?.name}</h3>
                                            </div>
                                            <div>
                                                {group?.private === false ? <h4 style={{color:'silver'}}>Public</h4> : <h4 style={{color:'silver'}}>Private</h4>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='secondBox-eventDetails'>
                                        <p>{`START ${event?.startDate}`}</p>
                                        <p>END {event?.endDate}</p>
                                        {event?.price === 0 ? <p>FREE</p> : <p>${event?.price}</p>}

                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <p>{event?.type}</p>

                                            {areYouMaster() &&
                                            <div>
                                                <button className='groupbuttons' onClick={handleEdit}>
                                                    Update
                                                </button>
                                                
                                                <button className='groupbuttons' onClick={deleteModal}>
                                                    Delete
                                                </button>
                                            </div>

                                            }
                                        </div>
                                    </div>

                                </div>

                            </li>
                        </ul>

                     <div className='descriptionContainer'>
                        <div className='descriptionOfEvent'>
                            <h2 style={{marginBottom:'0'}}>Details</h2>
                            <p style={{ lineHeight: '1.5' }}>{event?.description}</p>

                        </div>
                     </div>


                </div>
            </div>

        </div>


            <div>

            </div>
        </div>
    );
}
