import React from 'react'
import PropTypes from 'prop-types'
import SearchByAgeMethodSelect from 'common/search/age/SearchByAgeMethodSelect'
import AgeSearchFields from 'common/search/age/AgeSearchFields'
import SexAtBirthSelect from 'common/search/sexatbirth/SexAtBirthSelect'
import MaskedSearchInput from 'common/search/MaskedSearchInput'
import {PersonSearchFieldsPropType, PersonSearchFieldsDefaultProps} from 'data/personSearch'

const PersonSearchAgeGenderNumbersGroup = ({onBlur, onChange, personSearchFields, onFocus, clientIdError, ssnErrors, dobErrors, onKeyPress, onKeyUp}) => {
  const actions = {onBlur, onChange, onFocus, onKeyPress}

  return (
    <div className="row">
      <div className="col-md-3 age-search-field-container">
        <SearchByAgeMethodSelect
          gridClassName="search-by-age-method-field"
          id="search-by-age-method"
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={personSearchFields.searchByAgeMethod}
        />
        <AgeSearchFields
          dobErrors={dobErrors}
          onBlur={onBlur}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          personSearchFields={personSearchFields}
        />
      </div>
      <SexAtBirthSelect
        id="search-sex-at-birth"
        gridClassName="col-md-3 sex-at-birth-field"
        onChange={onChange}
        value={personSearchFields.sexAtBirth}
        onKeyPress={onKeyPress}
      />
      <MaskedSearchInput
        errors={clientIdError}
        label="Client ID Number"
        name="clientId"
        mask='1111-1111-1111-1111111'
        value={personSearchFields.clientId}
        {...actions}
      />
      <MaskedSearchInput
        errors={ssnErrors}
        label='Social Security Number'
        name='ssn'
        mask='111-11-1111'
        value={personSearchFields.ssn}
        {...actions}
      />
    </div>
  )
}

PersonSearchAgeGenderNumbersGroup.propTypes = {
  clientIdError: PropTypes.array,
  dobErrors: PropTypes.array,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  personSearchFields: PersonSearchFieldsPropType,
  ssnErrors: PropTypes.array,
}

PersonSearchAgeGenderNumbersGroup.defaultProps = PersonSearchFieldsDefaultProps

export default PersonSearchAgeGenderNumbersGroup
