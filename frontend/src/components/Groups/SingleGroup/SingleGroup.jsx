import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteGroup, getSingleGroup } from "../../../store/groups"
import './SingleGroup.css'

export default function OneGroup() {
    const {groupid: id} = useParams()
    const dispatch = useDispatch()
    let group = useSelector(state => state.groups.groups[id])
    const user = useSelector(state => state.session.user)
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getSingleGroup(id))

    }, [dispatch, id])

    const previewImage = group?.GroupImages?.find(image => image.preview)

    const areYouMaster = () => {
        if (group && user){
            return group.organizerId === user.id ? true : false
        }
    }
    const hnadleCreateEvent = () => {
        navigate(`/groups/${id}/event/new`)
    }

    const handleEdit = () => {
        navigate(`/groups/${id}/edit`)
    }

    const handleDelete = () => {
        dispatch(deleteGroup(group))
        navigate(`/groups`)
    }


    return (
        <div className='singlegroup'>
            <ul>
                <li key={group?.id}>
                    {previewImage && <img src={previewImage.url} alt="Group" style={{ width: '50%', height: 'auto' }} />}
                    <div className='groupname'>
                        <h2>{group?.name}</h2>
                    </div>
                    <div>
                        <p>{`${group?.city}, ${group?.state}`}</p>
                        <p>{group?.type}</p>
                        <p>{group?.about}</p>
                        <p>{group?.numMembers} members</p>
                    </div>
                </li>
            </ul>
            <div>
                {areYouMaster() &&
                    <div>
                            <button onClick={hnadleCreateEvent}>
                                Create an Event!
                            </button>

                            <button onClick={handleEdit}>
                                Edit
                            </button>

                            <button onClick={handleDelete}>
                                Delete
                            </button>
                    </div>
                }
            </div>
        </div>
    );
}
