import InputField from './InputField.jsx'
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField
            title="username"
            value={username}
            handleChange={handleUsernameChange}
          />
        </div>
        <div>
          <InputField
            title="password"
            value={password}
            handleChange={handlePasswordChange}
            type='password'
          />
        </div>
        <button id='loginButton' type="submit">login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm