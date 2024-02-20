import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../store/events';
import './AllEvents.css'


export default function AllEventsOnPage() {
    let events = useSelector(state => {
        console.log("🚀 ~ events ~ state:", state.events.events.Events)
        return state.events.events.Events
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    return (
        <div className='events'>
            <ul>
                {events && events.map( events => (
                    <li
                        key={events.id}
                        onClick={() => navigate(`/events/${events.id}`)}
                    >
                        <img src={events.previewImage}></img>
                        <h2>{events.name}</h2>
                        <p>{`${events.startDate}, ${events.endDate}`}</p>
                        <p>{events.type}</p>
                        <p>{events.about}</p>
                        <p>{events.numAttending} attendees</p>
                    </li>
                ))}
            </ul>
        </div>


      );
}
