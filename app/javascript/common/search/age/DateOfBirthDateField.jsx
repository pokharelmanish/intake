import React from 'react'
import PropTypes from 'prop-types'
import {FormField, DatePicker} from '@cwds/components'

class DateOfBirthDateField extends React.Component {
  render() {
    const {value, onBlur, onChange, errors} = this.props
    return (
      <FormField
        id="search-date-of-birth"
        name="dob"
        label="Date"
        Component={DatePicker}
        value={value}
        error={errors}
        onChange={(event, newValue) => {
          onChange('dateOfBirth', newValue)
        }}
        onBlur={() => onBlur('dateOfBirth')}
      />

    )
  }
}

DateOfBirthDateField.propTypes = {
  errors: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  value: PropTypes.string,
}

export default DateOfBirthDateField
