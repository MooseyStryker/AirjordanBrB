import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { editThisGroup, getSingleGroup } from '../../../store/groups';
import { addGroupImage } from '../../../store/groupimages';

export default function UpdateGroup() {
    const {groupid: id} = useParams()
    const user = useSelector(state => state.session.user)
    const group = useSelector(state => state.groups.groups[id])


    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [type, setType] = useState('')
    const [privateGroup, setPrivateGroup] = useState("Private");
    const [location, setLocation] = useState('');
    const [groupImage, setGroupImage] = useState('')
    const [city] = useState('')
    const [state] = useState('')
    const [errors, setErrors] = useState({});
    const preview = true


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const areYouMaster = useCallback(() => {
      if (group && user){
          return group.organizerId === user.id ? true : false
      }
  }, [group, user]);

    useEffect(() => {
      if(!user || !areYouMaster()) {
        navigate('/');
    }
        const errors = {};
        if (!name) errors.name = 'Name field is required';
        if (name.length > 60) errors.name = 'Name must be 60 characters or less'
        if (about.length < 50) errors.about = 'About must have 50 characters or more';
        if (type !== 'Online' && type !== 'In person') errors.type = 'Type must be "Online" or "In person"';
        if (!city) errors.city = 'City is required';
        if (!state) errors.state = 'State is required';



        setErrors(errors);

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
            setLocation(`${group.city}, ${group.state}`)
        }
    }, [group])

    const handleSubmit = async(e) => {
        e.preventDefault()

        setErrors({})

        const [city, state] = location.split(', ').map(item => item.trim());

        const edittedGroup = {
        name,
        about,
        type,
        private: privateGroup === 'Private' ? true : false,
        city,
        state
        }

        const submittedGroup = await dispatch(editThisGroup(edittedGroup, id))

        const groupId = submittedGroup.id

        const groupImageUpload = {
          url: groupImage,
          preview
        }

        await dispatch(addGroupImage(groupImageUpload, groupId))

        navigate(`/groups/${submittedGroup.id}`)

    }

    return (
      <form className='group-form' onSubmit={handleSubmit}>

      <div className='organizer-title'>
        <p className='ptagthing'>UPDATE YOUR GROUP&apos;S INFORMATION</p>
        <h2>We&apos;ll walk you through a few steps to update your group&apos;s information</h2>
      </div>

      <div className='locationdiv'>
        <h2 className="form-title">First, set your group&apos;s location</h2>
        <p className="form-description">Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>

        <div>
          <label className='create-group-label'>
            City, STATE
            </label>
            <input
              className='create-group-input'
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          {errors.location && <p className='errors' style={{ color: 'red', fontSize: '12px'}}>{errors.location}</p>}
        </div>
      </div>

      <div className='group-name-div'>
        <h2 className="form-title">What will your group&apos;s name be?</h2>
        <p className="form-description">Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>

        <label className='create-group-label'>
          What is your group name?
          </label>
          <input
            className='create-group-input'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        {errors.name && <p className='errors' style={{ color: 'red', fontSize: '12px'}}>{errors.name}</p>}
      </div>


      <div className='group-description'>

        <h2 className="form-title">Now describe what your group will be about</h2>
        <p className="form-description">People will see this when we promote your group, but you&apos;ll be able to add it later too.</p>

        <div className='create-group-label'>
          <p>1. What&apos;s purpose of the group?</p>
          <p>2. Who should join?</p>
          <p>3. What will you do at events?</p>
        </div>
          <textarea
            rows="10"
            cols="50"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        {errors.about && <p className='errors' style={{ color: 'red', fontSize: '12px'}}>{errors.about}</p>}

      </div>

      <div className='final-steps'>
        <h2 className="form-title">Final steps...</h2>

        <label className='create-group-label'>
          Is this an in person or online group?
        </label>
          <select className='create-group-input-smaller' value={type} onChange={(e) => setType(e.target.value)} >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
        {errors.type && <p className='errors' style={{ color: 'red', fontSize: '12px'}}>{errors.type}</p>}

        <label className='create-group-label'>
          Is this private or public?
        </label>
        <select className='create-group-input-smaller' value={privateGroup} onChange={(e) => setPrivateGroup(e.target.value)} >
            <option value="Private">Private</option>
            <option value="Public">Public</option>
        </select>

        {errors.visibility && <p className='errors' style={{ color: 'red', fontSize: '12px'}}>{errors.visibility}</p>}

        <label className='create-group-label'>
          Please add an image URL for your group below:
          </label>
          <input
          className='create-group-input'
            type="text"
            value={groupImage}
            onChange={(e) => setGroupImage(e.target.value)}
            />

      </div>
      <button className='signupButton' type="submit">Create Group</button>

    </form>



    //     <form onSubmit={handleSubmit}>
    //         <label>
    //             Name
    //             <input
    //                 type="text"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //             />
    //          </label>
    //   {errors.name && <p style={{ color: 'red', fontSize: '12px'}}>{errors.name}</p>}

    //   <label>
    //     About
    //     <textarea
    //       value={about}
    //       onChange={(e) => setAbout(e.target.value)}
    //     />
    //   </label>
    //   {errors.about && <p style={{ color: 'red', fontSize: '12px'}}>{errors.about}</p>}

    //   <label>
    //     Type
    //     <select value={type} onChange={(e) => setType(e.target.value)} >
    //       <option value="In person">In person</option>
    //       <option value="Online">Online</option>
    //     </select>
    //   </label>


    //   <label>
    //     Private
    //     <input
    //       type="checkbox"
    //       checked={privateGroup}
    //       onChange={(e) => setPrivateGroup(e.target.checked)}
    //     />
    //   </label>

    //   <div>
    //   <label>
    //     City
    //     <input
    //       type="text"
    //       value={city}
    //       onChange={(e) => setCity(e.target.value)}
    //     />
    //   </label>
    //   {errors.city && <p style={{ color: 'red', fontSize: '12px'}}>{errors.city}</p>}
    //   </div>

    //   <label>
    //     State
    //     <input
    //       type="text"
    //       value={state}
    //       onChange={(e) => setState(e.target.value)}
    //     />
    //   </label>
    //  {errors.state && <p style={{ color: 'red', fontSize: '12px'}}>{errors.state}</p>}

    //         {areYouMaster() && <button type="submit">Update Group</button>}
    //     </form>
    )
}
