import { useState } from "react"
import { useEffect } from "react"
import { createAnEvent } from "../../../store/events"
import { useDispatch } from 'react-redux';
import {
    useNavigate,
    useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { getSingleGroup } from "../../../store/groups";
import './CreateEvent.css'
import { addEventImage } from "../../../store/eventimages";



export default function CreateEvent(){
    const sessionUser = useSelector((state) => state.session.user);

    const {groupid: id} = useParams()

    const [ name, setName ] = useState('')
    const [ eventType, setEventType ] = useState("In person")
    const [ visibility, setVisibility ] = useState('Public')
    const [ price, setPrice ] = useState('')
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')
    const [ imageUrl, setImageUrl ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ errors, setErrors ] = useState({})

    let capacity = parseInt(0)
    let preview = true
    let venueId = 1

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const group = useSelector(state => state.groups.groups[id])



    useEffect(() => {
        if(!sessionUser) {
            navigate('/')
          }

          dispatch(getSingleGroup(id))
        }, [dispatch, sessionUser, navigate, id]);





    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})

        const errors = {};
        if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters';
        if (name.length > 60) errors.name = 'Name must be 60 characters or less';
        if (eventType !== 'Online' && eventType !== 'In person') errors.eventType = 'Event type must be "Online" or "In person"';
        if (!price || isNaN(price)) errors.price = 'Price is invalid';
        if (!description || description.length < 30) errors.description = 'Description needs 30 or more characters';
        if (new Date(startDate) <= new Date()) errors.startDate = 'Start date must be in the future';
        if (new Date(endDate) < new Date(startDate)) errors.endDate = 'End date is less than start date';
        if (!imageUrl)  errors.imageUrl = 'Image Url is required';

        if (imageUrl) {
            const fileExtension = imageUrl.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
              errors.imageUrl = 'Group image must be a .jpg, .jpeg, or .png file';
            }
          }
        setErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const newEvent = {
            groupId: id,
            venueId,
            name,
            type: eventType,
            //   visibility,
            price: parseInt(price),
            startDate,
            endDate,
            description,
            capacity: parseInt(capacity)
        }
        console.log("🚀 ~ handleSubmit ~ newEvent:", newEvent)

        const createEvent = await dispatch(createAnEvent(newEvent,id))
        const eventId = createEvent.id


        const imageUploaded = {
            url: imageUrl,
            preview
        }

        await dispatch(addEventImage(imageUploaded, eventId))


        navigate(`/groups/${id}`)
      };



      return (
        <div className="form-container">


            <div className="backgroundcolordiv">
                <div className="create-event-form">


                    <div className="event-title">
                        {<h2>Create an event for {group?.name} </h2>}
                    </div>

                    <form className="event-form" onSubmit={handleSubmit}>

                        <div className='firstEventDiv'>


                            <div>
                                <label className='create-event-label'>
                                What is the name of your event?
                                    </label>
                                    <input
                                    className='create-event-input'
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                {errors.name && <p style={{ color: 'red', fontSize: '12px', marginTop: '0'}}>{errors.name}</p>}
                            </div>

                        </div>



                        <div style={{borderTop: '1px solid grey'}}>
                            <label className='create-event-label' style={{marginTop:'15px', marginBottom:'10px'}}>
                                Is this an in person or online event?
                            </label>
                            <select className='create-event-input-smaller' value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                <option value="In person">In person</option>
                                <option value="Online">Online</option>
                            </select>
                            {errors.eventType && <p className="errors" style={{ color: 'red', fontSize: '12px', marginTop: '0'}}>{errors.eventType}</p>}
                        </div>



                        <label className='create-event-label'>
                            Is this event private or public?
                        </label>
                        <select className='create-event-input-smaller' value={visibility} onChange={(e) => setVisibility(e.target.value)} >
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                        </select>




                        <label className='create-event-label'>
                            What is the price for your event?
                        </label>
                            <input
                            className='create-event-input-smaller'
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                />
                        {errors.price && <p className="errors" style={{ color: 'red', fontSize: '12px', marginTop: '0'}}>{errors.price}</p>}


                        <div style={{borderTop: '1px solid grey'}}>
                            <label className='create-event-label' style={{marginTop: '15px'}}>
                                When does your event start?
                            </label>
                                <input
                                    className='create-event-date-input'
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            {errors.startDate && <p className="errors" style={{ color: 'red', fontSize: '12px'}}>{errors.startDate}</p>}
                        </div>



                        <label className='create-event-label'>
                            When does your event end?
                        </label>
                            <input
                                style={{marginBottom: '17px'}}
                                className='create-event-date-input'
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        {errors.endDate && <p className="errors" style={{ color: 'red', fontSize: '12px'}}>{errors.endDate}</p>}



                        <div style={{borderTop: '1px solid grey'}} >
                            <label className='create-event-label'>
                                Please add in image url for your event below:
                            </label>
                                <input
                                    className='create-event-input'
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            {errors.imageUrl && <p className="errors" style={{ color: 'red', fontSize: '12px', marginTop: '0'}}>{errors.imageUrl}</p>}
                        </div>

                        <div style={{borderTop: '1px solid grey'}} >
                            <label className='create-event-label'>
                                Please describe your event:
                            </label>
                                <textarea
                                    rows="10"
                                    cols="58"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            {errors.description && <p className="errors" style={{ color: 'red', fontSize: '12px', marginTop: '0'}}>{errors.description}</p>}
                        </div>

                        <button className="signupButton" type="submit">Create Event</button>
                    </form>
                </div>
            </div>

        </div>
    );

}
