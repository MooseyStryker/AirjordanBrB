import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className='signupbigtitle'>Sign Up</h1>
      <div className='form-container'>
        <form className='signup-form' onSubmit={handleSubmit}>
        {Object.values(errors).map((error, index) => (
          <p key={index} style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{error}</p>
        ))}
          <label>
            First Name
          </label>
            <input
            className='inputbox'
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          {/* {errors.firstName && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.firstName}</p>} */}
          <label>
            Last Name
          </label>
            <input
            className='inputbox'
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          {/* {errors.lastName && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.lastName}</p>} */}
          <label style={{marginTop:'20px'}}>
            Email
          </label>
            <input
              className='inputbox'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          {/* {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.email}</p>} */}
          <label>
            Username
          </label>
            <input
            className='inputbox'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          {/* {errors.username && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.username}</p>} */}
          <label style={{marginTop:'20px'}}>
            Password
          </label>
            <input
            className='inputbox'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          {/* {errors.password && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.password}</p>} */}
          <label>
            Confirm Password
          </label>
            <input
            className='inputbox'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          {/* {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{errors.confirmPassword}</p>} */}
        </form>
          <button onClick={handleSubmit} className='signupButton' type="submit">Sign Up</button>
      </div>
    </>
  );

}

export default SignupFormModal;
