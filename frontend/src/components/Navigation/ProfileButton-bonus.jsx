import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import profilePic from '../../images/navigation/profile.png'
import './ProfileButton.css'
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const goToGroups = (e) => {
    e.preventDefault();
    navigate('/groups');
    closeMenu();
  }
  const goToEvents = (e) => {
    e.preventDefault();
    navigate('/events');
    closeMenu();
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {/* <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button> */}
       <div className='profileBox' style={{display: 'flex', alignItems: 'center'}} onClick={toggleMenu}>
        <img src={profilePic} style={{width:'50px'}}></img>
        <div style={{marginLeft:'10px'}}>
          <i className={`fas fa-caret-${showMenu ? "up" : "down"}`} style={{fontSize: '24px'}}></i>
        </div>
      </div>

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='profilemenu'>
            <li className='greetings' >Hello, {user.firstName}!</li>
            <li className='emailmenu'>{user.email}</li>
            <li
            onClick={goToGroups} style={{marginTop:'10px', marginBottom:'10px', cursor:'pointer'}}>
              View Groups!
            </li>
            <li
            onClick={goToEvents} style={{marginTop:'10px', marginBottom:'10px', cursor:'pointer'}}>
              View Events!
            </li>
            <li className='logoutspace' onClick={logout}>
              <p >Log Out</p>
            </li>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
