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
  const [isCredentialValid, setIsCredentialValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);


  const handleCredentialChange = (e) => {
    setCredential(e.target.value);
    setIsCredentialValid(e.target.value.length >= 4);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordValid(e.target.value.length >= 6);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data)
      if (data && data.message) {
        setErrors(data.message);
      }
    });
  };


  // Stupid async things
  const handleSubmitDemo = (e) => {
    e.preventDefault();
    setErrors({});

    const demoCredential = 'user1';
    const demoPassword = 'p';

    setCredential(demoCredential);
    setPassword(demoPassword);

    return dispatch(sessionActions.login({ credential: demoCredential, password: demoPassword }))
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
          <p style={{color: 'red', fontSize:'12px'}} className='errors'>The provided credentials are invalid</p>
        }


        <form onSubmit={handleSubmit}>
          <label>
            Username or Email
          </label>
          <input
            className='inputbox'
            type="text"
            value={credential}
            onChange={handleCredentialChange} // Use the new handler here
            required
          />
          <label>
            Password
          </label>
          <input
            className='inputbox'
            type="password"
            value={password}
            onChange={handlePasswordChange} // Use the new handler here
            required
          />
        </form>

        {errors.credential && <p>{errors.credential}</p>}

        {/* Disable the button and change its color based on the validity of the inputs */}
        <button
          onClick={handleSubmit}
          className='loginbuttontime'
          type="submit"
          disabled={!isCredentialValid || !isPasswordValid}
        >
          Log In
        </button>

        <button onClick={handleSubmitDemo} className='loginbuttontime' type="submit">Log in as Demo User</button>
      </div>
    </div>
  );
}

export default LoginFormModal;
