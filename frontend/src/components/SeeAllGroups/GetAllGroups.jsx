import { useDispatch, useSelector } from 'react-redux';
import {useEffect} from 'react'
import { getAllGroups } from '../../store/groups';
import './GetAllGroups.css'

export default function GetAllGroups() {
    let groups = useSelector(state => state.groups.groups.Groups)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <div className='groups'>
        <ul>
            {groups && groups.map( group => (
                <li key={group.id}>
                    <img src={group.previewImage}></img>
                    <h2>{group.name}</h2>
                    <p>{`${group.city}, ${group.state}`}</p>
                    <p>{group.type}</p>
                    <p>{group.about}</p>
                    <p>{group.numMembers} members</p>
                </li>
            ))}
        </ul>
        </div>

      );
}
