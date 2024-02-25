import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllGroups } from '../../../store/groups';
import { useNavigate } from 'react-router-dom';
import './GetAllGroups.css'

export default function GetAllGroups() {
    let groups = useSelector(state => state.groups.groups.Groups)
    console.log("🚀 ~ GetAllGroups ~ groups:", groups)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <div className='allcontents'>
            <div className='content-wrapper'>

                <div className='top-section'>

                    <div className='outofnames'>
                        <div className='all-events-groups'>
                            <div style={{marginRight: '40px'}} onClick={() => navigate('/events')}>
                                <p>Events</p>
                            </div>
                            <p style={{color: 'teal', textDecoration: 'underline'}}>Groups</p>

                        </div>

                        <div className='textbeneath'>
                            <p style={{color: 'grey'}}>Groups in MeetUpThatWay</p>
                        </div>
                    </div>

                </div>


                <div className='groups'>
                    <ul>
                        {groups && groups.map( group => (
                            <li
                                className='groupbox'
                                key={group.id}
                                onClick={() => navigate(`/groups/${group.id}`)}
                                style={{cursor:'pointer'}}
                            >
                                <div className='groupimagebox'>
                                    <img className='imageingroups' src={group.previewImage}></img>
                                </div>

                                <div>
                                    <h2>{group.name}</h2>
                                    <p>{`${group.city}, ${group.state}`}</p>
                                    <p>{group.type}</p>
                                    <p>{group.about}</p>
                                    <p>{group.numMembers} members</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>

      );
}
