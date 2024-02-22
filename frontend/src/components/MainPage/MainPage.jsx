import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import groupImage from '../../images/mainpage/groups.jpg'
import eventImage from '../../images/mainpage/events.jpg'
import createGroupImage from '../../images/mainpage/createGroup.jpg'
import './MainPage.css';
import NotLoggedInModal from '../PermssionModal/PermissionModal';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';

export default function MainPage() {
    const sessionUser = useSelector((state) => state.session.user);
    const { setModalContent } = useModal();

    const navigate = useNavigate()

    const allGroups = () => {
        navigate(`/groups`)
    }
    const allEvents = () => {
        navigate(`/events`)
    }
    const createGroup = () => {
        if (!sessionUser){
            setModalContent(<NotLoggedInModal />);
        } else {
            navigate(`/groups/new`);
        }
    }
    const signupModal = () => {
        setModalContent(<SignupFormModal />)
    }

    return (
        <div className="main-page">

            <div className='welcome'>
                <h1>The Introverts platform—</h1>
                <h2>Where distance becomes friendships</h2>
            </div>

            <div className="how-it-works">
                <div className="findgroups" onClick={allGroups} >
                    <img src={groupImage} alt="See all groups" />
                    <p>Find all groups away from me!</p>
                </div>

                <div className="findevents" onClick={allEvents}>
                    <img src={eventImage} alt="Find an event" />
                    <p>Find an event that way!</p>
                </div>

                <div className="creategroup" onClick={createGroup}>
                    <img src={createGroupImage} alt="Start a new group" />
                    <p>Start a new introvert binge</p>
                </div>

            </div>

            <button className='Joinusalready' type="button" onClick={signupModal}>Join Meetup</button>
        </div>
    );
}
