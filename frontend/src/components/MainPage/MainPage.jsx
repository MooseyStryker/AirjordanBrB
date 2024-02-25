import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import groupImage from '../../images/mainpage/groups.jpg'
import eventImage from '../../images/mainpage/events.jpg'
import createGroupImage from '../../images/mainpage/createGroup.jpg'
import mainImage from '../../images/mainpage/mainpagePhoto.jpg'
import './MainPage.css';
import NotLoggedInModal from '../PermissionModal/PermissionModal';
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
                <div className='welcomeText'>
                    <h1 className='fixtxtalign' >The Introverts Platform</h1>
                    <h2 className='fixtxtalign' >Where distance becomes friendships</h2>
                    <p id='ptagchagne' >“The Introverts Platform” is a revolutionary digital space designed specifically for introverts. It provides a safe, comfortable environment where introverts can connect, share ideas, and build meaningful relationships while respecting their need for personal space and solitude.</p>
                    <p id='ptagchagne' >“The platform offers a variety of features tailored to the introvert lifestyle. For instance, users can engage in one-on-one conversations or participate in small group discussions, all at their own pace. The platform also includes a ‘Quiet Mode’, allowing users to take a break from social interactions whenever they need it!</p>
                </div>
                <div>
                    <img className='maingImageMainPage' src={mainImage} />
                </div>
            </div>

            {/* I need a center text on how the webpage works and have it centered on the page */}
            <div className="descriptionmeetup">
                <h2>How MeetUpThatWay works</h2>
                <p>You can people watch or just stay at home!</p>
            </div>


            <div style={{cursor:'pointer'}} className="how-it-works">
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
                    <p style={{ color: !sessionUser ? 'grey' : 'initial' }}>Start a new introvert binge</p>
                </div>

            </div>

            {!sessionUser && <button className='Joinusalready' type="button" onClick={signupModal}>Join Meetup</button>}
        </div>
    );
}
