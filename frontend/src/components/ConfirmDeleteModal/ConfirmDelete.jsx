import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useParams } from 'react-router-dom';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';


function ConfirmDelete({ onDelete }) {
  console.log("🚀 ~ ConfirmDelete ~ onDelete:", onDelete)
  const {groupid: id} = useParams()
  console.log("🚀 ~ ConfirmDelete ~ d:", id)
  const group = useSelector(state => state.groups.groups[id])
  const user = useSelector(state => state.session.user)

  const { closeModal } = useModal();
  // const { setModalContent } = useModal();


  const areYouMaster = () => {
    if (group && user) {
      if (group.organizerId === user.id) {
        return true;
      } else {
        closeModal();
        return false;
      }
    }
  }

  console.log("🚀 ~ ConfirmDelete ~ areYouMaster:", areYouMaster())


  return (
    <div id='modal-contents'>
      <h1>Confirm Delete</h1>
      <p className='messageInModal'>Are you sure you want to delete? There&apos;s no restoring this action.</p>


      <div className='buttonBox'>
        <div>
          <button className='Joinusalready' type="button" onClick={onDelete}>Yes, Delete!</button>
        </div>

        <button className='Joinusalready' type="button" onClick={() => closeModal()}>No, do not delete this.</button>
      </div>


    </div>
  );
}

export default ConfirmDelete;
