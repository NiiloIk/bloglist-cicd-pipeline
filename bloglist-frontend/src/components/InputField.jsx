import PropTypes from 'prop-types'

const InputField = ({ title, value, handleChange, type='text' }) => {
  return (
    <>
      <label htmlFor={title} >{title}</label>
      <input
        id={title}
        type={type}
        value={value}
        onChange={handleChange}
      /><br />
    </>
  )
}

InputField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
}

export default InputField