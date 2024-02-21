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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const group = useSelector(state => state.groups.groups[id])


    useEffect(() => {
        const errors = {};
        if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters';
        if (name.length > 60) errors.name = 'Name must be 60 characters or less';
        if (eventType !== 'Online' && eventType !== 'In person') errors.eventType = 'Event type must be "Online" or "In person"';
        if (!price || isNaN(price)) errors.price = 'Price is invalid';
        if (!description || description.length < 30) errors.description = 'Description needs 30 or more characters';
        if (new Date(startDate) <= new Date()) errors.startDate = 'Start date must be in the future';
        if (new Date(endDate) < new Date(startDate)) errors.endDate = 'End date is less than start date';


        dispatch(getSingleGroup(id))
        setErrors(errors);
    }, [name, eventType, price, description, startDate, endDate, id, dispatch]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})

        const newEvent = {
            groupId: id,
            name,
            type: eventType,
            //   visibility,
            price: parseInt(price),
            startDate,
            endDate,
            description,
            capacity: parseInt(capacity)
        }

        const createEvent = await dispatch(createAnEvent(newEvent,id))
        const eventId = createEvent.id
        console.log("🚀 ~ handleSubmit ~ eventId:", eventId)

        const imageUploaded = {
            url: imageUrl,
            preview
        }

        await dispatch(addEventImage(imageUploaded, eventId))


        navigate(`/groups/${id}`)
      };

      return (
        <div>

            {<h2>Create an event for: {group?.name} </h2>}

        <form onSubmit={handleSubmit}>
            <label>
                Event Name
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            {errors.name && <p style={{ color: 'red', fontSize: '12px'}}>{errors.name}</p>}

            <label>
                Event Type
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} >
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
            </label>
            {errors.eventType && <p style={{ color: 'red', fontSize: '12px'}}>{errors.eventType}</p>}

            <label>
                Visibility
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)} >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>
            </label>

            <label>
                Price
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            {errors.price && <p style={{ color: 'red', fontSize: '12px'}}>{errors.price}</p>}

            <label>
                Start Date
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>
            {errors.startDate && <p style={{ color: 'red', fontSize: '12px'}}>{errors.startDate}</p>}

            <label>
                End Date
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>
            {errors.endDate && <p style={{ color: 'red', fontSize: '12px'}}>{errors.endDate}</p>}

            <label>
                Image URL
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </label>

            <label>
                Description
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            {errors.description && <p style={{ color: 'red', fontSize: '12px'}}>{errors.description}</p>}

            <button type="submit">Create Event</button>
        </form>
        </div>
    );

}
