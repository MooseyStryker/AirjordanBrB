import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './PermissionModal.css';

function NotLoggedInModal() {
  const sessionUser = useSelector(state => state.session.user);
  const { closeModal } = useModal();
  const { setModalContent } = useModal();

  if (sessionUser) {
    closeModal();
    return null;
  }

  const signupModal = () => {
    setModalContent(<SignupFormModal />)
  }

  const loginModal = () => {
    setModalContent(<LoginFormModal />)
  }

  return (
    <div id='modal-contents'>
      <h1>Welcome!</h1>
      <p className='messageInModal'>We&apos;d love for you to join our introvert band, but you need to join first!</p>


      <div className='buttonBox'>
        <div>
          <button className='Joinusalready' type="button" onClick={loginModal}>Log in</button>
        </div>

        <button className='Joinusalready' type="button" onClick={signupModal}>Sign Up!</button>
      </div>


    </div>
  );
}

export default NotLoggedInModal;
