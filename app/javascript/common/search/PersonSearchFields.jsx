import React from 'react'
import PropTypes from 'prop-types'
import PersonSearchNameGroup from 'common/search/PersonSearchNameGroup'
import PersonSearchAgeGenderNumbersGroup from 'common/search/PersonSearchAgeGenderNumbersGroup'
import PersonSearchButtonGroup from 'common/search/PersonSearchButtonGroup'
import {PersonSearchFieldsPropType} from 'data/personSearch'

const PersonSearchFields = ({
  onBlur,
  onChange,
  onCancel,
  onSubmit,
  personSearchFields,
  clientIdError,
  ssnErrors,
  dobErrors,
  isAdvancedSearchOn,
  canSearch,
  onKeyPress,
  onKeyUp,
  onFocus,
}) => isAdvancedSearchOn ? (
  <div>
    <PersonSearchNameGroup
      onChange={onChange}
      personSearchFields={personSearchFields}
      onKeyPress={onKeyPress}
    />
    <PersonSearchAgeGenderNumbersGroup
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      personSearchFields={personSearchFields}
      clientIdError={clientIdError}
      ssnErrors={ssnErrors}
      dobErrors={dobErrors}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
    />
    <PersonSearchButtonGroup
      onSubmit={onSubmit}
      onCancel={onCancel}
      canSearch={canSearch}
    />
  </div>
) : null

PersonSearchFields.propTypes = {
  canSearch: PropTypes.bool,
  clientIdError: PropTypes.array,
  dobErrors: PropTypes.array,
  isAdvancedSearchOn: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  personSearchFields: PersonSearchFieldsPropType,
  ssnErrors: PropTypes.array,
}

export default PersonSearchFields
