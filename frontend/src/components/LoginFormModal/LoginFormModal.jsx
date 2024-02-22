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
    <>
      <h1>Log In</h1>


      <div className='login-form-container'>

      {Object.values(errors).length > 0 &&
        <p className='errors'>The provided credentials are invalid</p>
      }

        <form onSubmit={handleSubmit}>
          <label>
            Username or Email
            <input
            className='inputbox'
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              className='inputbox'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p>{errors.credential}</p>}
          <button className='loginbuttontime' type="submit">Log In</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
