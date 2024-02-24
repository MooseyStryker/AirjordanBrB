import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.message) {
        setErrors(data.message);
      }
    });
  };

  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>


      <div className='login-form-container'>

      {Object.values(errors).length > 0 &&
        <p className='errors'>The provided credentials are invalid</p>
      }

        <form onSubmit={handleSubmit}>
          <label>
            Username or Email
            </label>
            <input
            className='inputbox'
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          <label>
            Password
            </label>
            <input
              className='inputbox'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </form>
          {errors.credential && <p>{errors.credential}</p>}
          <button className='loginbuttontime' type="submit">Log In</button>
      </div>
    </div>
  );
}

export default LoginFormModal;
