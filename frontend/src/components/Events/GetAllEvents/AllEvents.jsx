import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../../store/events';
import './AllEvents.css'


export default function AllEventsOnPage() {
    let events = useSelector(state => {
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
                {events && events.map( event => (
                    <li
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                    >
                        <img src={event.previewImage}></img>
                        <h2>{event.name}</h2>
                        <p>{`${event.startDate}, ${event.endDate}`}</p>
                        <p>{event.type}</p>
                        <p>{event.about}</p>
                        <p>{event.numAttending} attendees</p>
                    </li>
                ))}
            </ul>
        </div>


      );
}
