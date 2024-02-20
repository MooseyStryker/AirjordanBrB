import { useState } from "react"
import { useEffect } from "react"
import { createAnEvent } from "../../../store/events"
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';



export default function CreateEvent(){
    const {groupid: id} = useParams()
    console.log("🚀 ~ CreateEvent ~ id:", id)

    const [ name, setName ] = useState('')
    const [ eventType, setEventType ] = useState("In person")
    const [ visibility, setVisibility ] = useState('Public')
    const [ price, setPrice ] = useState('')
    const [ startDate, setStartDate ] = useState('')
    const [ endDate, setEndDate ] = useState('')
    const [ imageUrl, setImageUrl ] = useState('')
    const [ description, setDescription ] = useState('')
    const capacity = parseInt(0)
    const [ errors, setErrors ] = useState({})

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const errors = {};
        if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters';
        if (name.length > 60) errors.name = 'Name must be 60 characters or less';
        if (eventType !== 'Online' && eventType !== 'In person') errors.eventType = 'Event type must be "Online" or "In person"';
        if (!price || isNaN(price)) errors.price = 'Price is invalid';
        if (!description || description.length < 30) errors.description = 'Description needs 30 or more characters';
        if (new Date(startDate) <= new Date()) errors.startDate = 'Start date must be in the future';
        if (new Date(endDate) < new Date(startDate)) errors.endDate = 'End date is less than start date';

        setErrors(errors);
    }, [name, eventType, price, description, startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})

        const newEvent = {
          name,
          type: eventType,
          visibility,
          price,
          startDate,
          endDate,
          imageUrl,
          description,
          capacity
        }

        const submittedGroup = await dispatch(createAnEvent(newEvent))

        navigate(`/groups/${id}`)
      };

      return (
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
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>
            {errors.startDate && <p style={{ color: 'red', fontSize: '12px'}}>{errors.startDate}</p>}

            <label>
                End Date
                <input
                    type="date"
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
    );

}
