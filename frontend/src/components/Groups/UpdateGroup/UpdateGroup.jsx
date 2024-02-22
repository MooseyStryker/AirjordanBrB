import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { editThisGroup, getSingleGroup } from '../../../store/groups';

export default function UpdateGroup() {
    const {groupid: id} = useParams()
    const user = useSelector(state => state.session.user)
    const group = useSelector(state => state.groups.groups[id])
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privateGroup, setPrivateGroup] = useState(false)
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const areYouMaster = useCallback(() => {
      if (group && user){
          return group.organizerId === user.id ? true : false
      }
  }, [group, user]);

    useEffect(() => {
      if(!user) {
        navigate('/')
      }
        const errors = {};
        if (!name) errors.name = 'Name field is required';
        if (name.length > 60) errors.name = 'Name must be 60 characters or less'
        if (about.length < 50) errors.about = 'About must have 50 characters or more';
        if (type !== 'Online' && type !== 'In person') errors.type = 'Type must be "Online" or "In person"';
        if (!city) errors.city = 'City is required';
        if (!state) errors.state = 'State is required';



        setErrors(errors);
        const isMaster = areYouMaster()
        if (isMaster === false){
            navigate('/groups')
        }
      }, [name, about, type, privateGroup, city, state, areYouMaster, navigate, user]);

    useEffect(() => {
        dispatch(getSingleGroup(id))
    }, [dispatch, id])

    useEffect(() => {
        if (group) {
            setName(group.name)
            setAbout(group.about)
            setType(group.type)
            setPrivateGroup(group.private)
            setCity(group.city)
            setState(group.state)
        }
    }, [group])

    const handleSubmit = async(e) => {
        e.preventDefault()

        setErrors({})

        const edittedGroup = {
        name,
        about,
        type,
        private: privateGroup,
        city,
        state
        }

        const submittedGroup = await dispatch(editThisGroup(edittedGroup, id))

        navigate(`/groups/${submittedGroup.id}`)

    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
             </label>
      {errors.name && <p style={{ color: 'red', fontSize: '12px'}}>{errors.name}</p>}

      <label>
        About
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </label>
      {errors.about && <p style={{ color: 'red', fontSize: '12px'}}>{errors.about}</p>}

      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)} >
          <option value="In person">In person</option>
          <option value="Online">Online</option>
        </select>
      </label>


      <label>
        Private
        <input
          type="checkbox"
          checked={privateGroup}
          onChange={(e) => setPrivateGroup(e.target.checked)}
        />
      </label>

      <div>
      <label>
        City
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>
      {errors.city && <p style={{ color: 'red', fontSize: '12px'}}>{errors.city}</p>}
      </div>

      <label>
        State
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </label>
     {errors.state && <p style={{ color: 'red', fontSize: '12px'}}>{errors.state}</p>}

            {areYouMaster() && <button type="submit">Update Group</button>}
        </form>
    )
}
