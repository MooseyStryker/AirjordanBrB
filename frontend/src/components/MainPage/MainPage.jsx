import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import groupImage from '../../images/mainpage/groups.jpg'
import eventImage from '../../images/mainpage/events.jpg'
import createGroupImage from '../../images/mainpage/groups.jpg'

import './MainPage.css';

export default function MainPage() {
    const sessionUser = useSelector((state) => state.session.user);
    console.log("🚀 ~ MainPage ~ sessionUser:", sessionUser)



    const navigate = useNavigate()

    const allGroups = () => {
        navigate(`/groups`)
    }
    const allEvents = () => {
        navigate(`/events`)
    }
    const createGroup = () => {
        navigate(`/groups/new`)
    }

    return (
        <div className="main-page">
            <h1>The people platform—</h1>
            <h2>Where interests become friendships</h2>

            <div className="how-it-works">
                <div className="findgroups" onClick={allGroups} >
                    <img src={groupImage} alt="See all groups" />
                    <p>See all groups</p>
                </div>

                <div className="findevents" onClick={allEvents}>
                    <img src={eventImage} alt="Find an event" />
                    <p>Find an event</p>
                </div>

                <div className="creategroup" onClick={createGroup}>
                    <img src={createGroupImage} alt="Start a new group" />
                    <p>Start a new group</p>
                </div>
            </div>

            <button type="button">Join Meetup</button>
        </div>
    );
}
