import {createReducer} from 'utils/createReducer'
import {fromJS} from 'immutable'
import {
  PEOPLE_SEARCH_CLEAR,
  PEOPLE_SEARCH_FETCH,
  PEOPLE_SEARCH_FETCH_COMPLETE,
  RESET_PERSON_SEARCH,
  SET_SEARCH_FIELD,
  SET_SEARCH_FIELD_ERROR_CHECK,
  LOAD_MORE_RESULTS_COMPLETE,
  SET_SEARCH_CURRENT_PAGE,
  SET_SEARCH_CURRENT_ROW,
} from 'actions/peopleSearchActions'
import {FETCH_USER_INFO_COMPLETE} from 'actions/userInfoActions'
import moment from 'moment'

const defaultSearchFieldsState = {
  searchTerm: '',
  lastName: '',
  firstName: '',
  middleName: '',
  clientId: '',
  suffix: '',
  ssn: '',
  dateOfBirth: '',
  approximateAge: '',
  approximateAgeUnits: '',
  searchByAgeMethod: 'dob',
  sexAtBirth: '',
  address: '',
  city: '',
  county: '',
  state: '',
  country: '',
  zipCode: '',
}

const initialState = fromJS({
  results: [],
  searchTableCurrentPage: 1,
  searchTableCurrentRow: 25,
  total: 0,
  defaultCounty: null,
  searchFields: defaultSearchFieldsState,
  errorCheckFields: {
    clientId: false,
    ssn: false,
    dateOfBirth: false,
  },
})

const setPersonSearchField = (state, {payload}) => {
  const {field, value} = payload
  const defaultRowNumber = 25
  const newSearchFields = state.get('searchFields').set(field, value)
  const newState = state.set('searchFields', newSearchFields)
  if (state.get('startTime')) {
    return newState
  } else if (value) {
    return newState.set('startTime', moment().toISOString())
      .set('searchTableCurrentPage', 1)
      .set('searchTableCurrentRow', defaultRowNumber)
  } else {
    return newState.set('startTime', null)
  }
}

const setPersonSearchFieldErrorCheck = (state, {payload}) => {
  const {field, value} = payload
  const newErrorCheck = state.get('errorCheckFields').set(field, value)
  const newState = state.set('errorCheckFields', newErrorCheck)
  return newState
}

const resetPersonSearchFields = state => {
  const defaultCounty = state.get('defaultCounty') || ''
  const searchFields = fromJS({...defaultSearchFieldsState, county: defaultCounty})
  return state.set('searchFields', searchFields)
}

export default createReducer(initialState, {
  [PEOPLE_SEARCH_FETCH](state) {
    return state.set('total', null)
  },
  [PEOPLE_SEARCH_FETCH_COMPLETE](
    state,
    {
      payload: {results, total},
      error,
    }
  ) {
    if (error) {
      return state
    } else {
      return state.set('results', fromJS(results)).set('total', total)
    }
  },
  [PEOPLE_SEARCH_CLEAR](
    state,
    {
      payload: {field},
    }
  ) {
    if (field === 'results') {
      return state
        .set('results', fromJS([]))
        .set('startTime', null)
        .set('total', null)
    } else if (field === 'age') {
      const searchFields = state.get('searchFields')
      const ageFields = fromJS({
        searchByAgeMethod: 'dob',
        dateOfBirth: '',
        approximateAge: '',
        approximateAgeUnits: '',
      })
      return state.set('searchFields', searchFields.merge(ageFields))
    }
    return state
  },
  [SET_SEARCH_FIELD]: setPersonSearchField,
  [SET_SEARCH_FIELD_ERROR_CHECK]: setPersonSearchFieldErrorCheck,
  [FETCH_USER_INFO_COMPLETE](
    state,
    {
      payload: {
        userInfo: {county},
      },
    }
  ) {
    if (county === 'State of California') {
      return state
    }
    const searchFields = state.get('searchFields')
    const isCountyEmpty = searchFields.get('county') === ''
    const newState = state.set('defaultCounty', county)
    const newSearchFields = searchFields.set('county', county)
    const newStateWithCounty = newState.set('searchFields', newSearchFields)

    return isCountyEmpty ? newStateWithCounty : newState
  },
  [LOAD_MORE_RESULTS_COMPLETE](
    state,
    {
      payload: {results},
      error,
    }
  ) {
    if (error) {
      return state
    } else {
      return state.update('results', arr => arr.concat(fromJS(results)))
    }
  },
  [RESET_PERSON_SEARCH]: resetPersonSearchFields,
  [SET_SEARCH_CURRENT_PAGE](state, {payload: {pageNumber}}) {
    return state.set('searchTableCurrentPage', pageNumber)
  },
  [SET_SEARCH_CURRENT_ROW](state, {payload: {rowNumber}}) {
    return state.set('searchTableCurrentRow', rowNumber)
  },
})
