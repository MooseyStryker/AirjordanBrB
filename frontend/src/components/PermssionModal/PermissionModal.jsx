import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
// import './NotLoggedInModal.css';

function NotLoggedInModal() {
  const sessionUser = useSelector(state => state.session.user);
  const { closeModal } = useModal();

  if (sessionUser) {
    closeModal();
    return null;
  }

  return (
    <div id='modal-content'>
      <h1>Welcome!</h1>
      <p>You need to be logged in to continue. Please log in or sign up.</p>
      <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal />}
      />
      <OpenModalButton
        buttonText="Sign Up"
        modalComponent={<SignupFormModal />}
      />
    </div>
  );
}

export default NotLoggedInModal;
