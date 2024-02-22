import { NavLink } from 'react-router-dom';
// import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import logo from '../../images/navigation/logo.jpg'
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './Navigation-Bonus.css'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const navigate = useNavigate()

  const { setModalContent } = useModal();

  const loginModal = () => {
    setModalContent(<LoginFormModal />)
  }
  const signupModal = () => {
    setModalContent(<SignupFormModal />)
  }

  const handleCreateGroup = () => {
    navigate('/groups/new')
  }

  return (
    <div className='navbar'>

      <div>
        <NavLink to="/">
          <img src={logo} alt="Home" className='nav-logo' style={{width: '100px'}}/>
        </NavLink>
      </div>

      <div className='finduser'>
        {!sessionUser &&
          <div className='userdiv'>


            <div className="Login-button" onClick={loginModal}>
            Log In
            </div>

            <div className="signup-button" onClick={signupModal}>
            Sign Up!
            </div>

          </div>
        }
      </div>



      {isLoaded && sessionUser &&

        <>
          <div>
            <p className='creatinggrouptag' style={{color:'teal'}} onClick={handleCreateGroup} >Start a new group</p>
            <ProfileButton user={sessionUser} />
          </div>
        </>


        }

    </div>
  );
}

export default Navigation;
