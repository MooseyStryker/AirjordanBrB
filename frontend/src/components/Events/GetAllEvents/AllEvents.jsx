import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../../store/events';
import './AllEvents.css'


export default function AllEventsOnPage() {
    let events = useSelector(state => {
        return state.events.events.Events
    })
    console.log("🚀 ~ events ~ events:", events)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    return (
        <div className='events-allcontents'>
            <div className='events-content-wrapper'></div>

                <div className='events-content-wrapper'>

                <div className='events-top-section'>

                    <div className='events-outofnames'>
                        <div className='events-all-events-groups'>
                            <p style={{color: 'teal', textDecoration: 'underline'}}>Events</p>
                            <div style={{marginLeft: '40px'}} onClick={() => navigate('/groups')}>
                                <p>Groups</p>
                            </div>

                        </div>

                        <div className='events-textbeneath'>
                            <p style={{color: 'grey'}}>Groups in Meetup</p>
                        </div>
                    </div>

                </div>

                <div className='events'>
                    <ul>
                        {events && events.map( event => {
                            console.log(event.startDate);
                            return (
                                <li
                                    className='eventbox'
                                    key={event.id}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                >
                                    <div className='eventimagebox'>
                                        <img className='imageinevents' src={event.previewImage}></img>
                                    </div>

                                    <div>
                                        <h2>{event.name}</h2>
                                        <p>{`${event.startDate} * ${event.endDate}`}</p>
                                        <p>{event.type}</p>
                                        <p>{event.description}</p>
                                        <p>{event.numAttending} attendees</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>


      );
}
