import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitNewGroup } from '../../../store/groups';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreateGroup() {
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
  const [privateGroup, setPrivateGroup] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});


  const dispatch = useDispatch();
  const navigate = useNavigate();




  useEffect(() => {
    if(!sessionUser) {
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
  }, [name, about, type, privateGroup, city, state, sessionUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})

    const newGroup = {
      name,
      about,
      type,
      private: privateGroup,
      city,
      state
    }

    const submittedGroup = await dispatch(submitNewGroup(newGroup))

    navigate(`/groups/${submittedGroup.id}`)
  };

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

      <button type="submit">Create Group</button>
    </form>
  );
}

export default CreateGroup;
