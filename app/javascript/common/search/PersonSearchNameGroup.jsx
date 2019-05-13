import React from 'react'
import PropTypes from 'prop-types'
import InputField from 'common/InputField'
import {PersonSearchFieldsPropType, PersonSearchFieldsDefaultProps} from 'data/personSearch'

const PersonSearchNameGroup = ({onChange, personSearchFields, onKeyPress}) => (
  <div className="row">
    <InputField
      id="search-last-name"
      gridClassName="col-md-3 last-name-field"
      label="Last Name"
      onChange={({target: {value}}) => onChange('lastName', value)}
      value={personSearchFields.lastName}
      onKeyPress={onKeyPress}
      maxLength='25'
    />
    <InputField
      id="search-first-name"
      gridClassName="col-md-3 first-name-field"
      label="First Name"
      onChange={({target: {value}}) => onChange('firstName', value)}
      value={personSearchFields.firstName}
      onKeyPress={onKeyPress}
      maxLength='20'
    />
    <InputField
      id="search-middle-name"
      gridClassName="col-md-3 middle-name-field"
      label="Middle Name"
      onChange={({target: {value}}) => onChange('middleName', value)}
      value={personSearchFields.middleName}
      onKeyPress={onKeyPress}
      maxLength='20'
    />
    <InputField
      id="search-suffix"
      gridClassName="col-md-3 suffix-field"
      label="Suffix"
      onChange={({target: {value}}) => onChange('suffix', value)}
      value={personSearchFields.suffix}
      maxLength='4'
      onKeyPress={onKeyPress}
    />
  </div>
)

PersonSearchNameGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  personSearchFields: PersonSearchFieldsPropType,
}

PersonSearchNameGroup.defaultProps = PersonSearchFieldsDefaultProps

export default PersonSearchNameGroup
