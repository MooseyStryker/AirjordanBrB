import { NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import logo from '../../images/navigation/logo.jpg'

// import './Navigation.css';
import './navigationbonus.css'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navbar'>

      <div>
        <NavLink to="/">
          <img src={logo} alt="Home" className='nav-logo' style={{width: '100px'}}/>
        </NavLink>
      </div>

      <div className='finduser'>
        {!sessionUser &&
          <div>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </div>
        }
      </div>



      {isLoaded && sessionUser &&
        <div>
        (<ProfileButton user={sessionUser} />)
        </div>
        }

    </div>
  );
}

export default Navigation;
