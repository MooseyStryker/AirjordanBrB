import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleGroup } from "../../store/groups"
import './SingleGroup.css'

export default function OneGroup() {
    const {groupid: id} = useParams()
    const dispatch = useDispatch()
    let group = useSelector(state => state.groups.groups[id])

    useEffect(() => {
        dispatch(getSingleGroup(id))
    }, [dispatch, id])

    const previewImage = group?.GroupImages?.find(image => image.preview)

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
        </div>
    );
}
