import PropTypes from 'prop-types'

const mapObject = (obj, f) => {
  const newObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    newObj[key] = f(value)
  })
  return newObj
}

const SEARCH_PARAMS = Object.freeze({
  approximateAge: 'approximate_age',
  approximateAgeUnits: 'approximate_age_units',
  searchByAgeMethod: 'search_by_age_method',
  clientId: 'client_id',
  dateOfBirth: 'date_of_birth',
  firstName: 'first_name',
  sexAtBirth: 'gender',
  lastName: 'last_name',
  middleName: 'middle_name',
  ssn: 'ssn',
  suffix: 'suffix',
  searchTerm: 'search_term',
})

export const toAPIParams = fields => {
  const params = {}
  Object.entries(SEARCH_PARAMS).forEach(([fieldName, paramName]) => {
    params[paramName] = fields[fieldName]
  })
  return params
}

export const lowerCaseFieldValues = fields => {
  const params = {}
  Object.entries(fields).forEach(([key, value]) => {
    params[key] = value.toLowerCase()
  })
  return params
}

export const PersonSearchFieldsPropType = PropTypes.shape(mapObject(SEARCH_PARAMS, () => PropTypes.string))
export const PersonSearchFieldsDefaultProps = {personSearchFields: mapObject(SEARCH_PARAMS, () => '')}
