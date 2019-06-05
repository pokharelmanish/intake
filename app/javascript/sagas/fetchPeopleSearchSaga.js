import {takeLatest, put, call, select} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {get} from 'utils/http'
import {logEvent} from 'utils/analytics'
import {PEOPLE_SEARCH_FETCH, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'
import {getStaffIdSelector} from 'selectors/userInfoSelectors'
import {selectSearchResultsCurrentRow} from 'selectors/peopleSearchSelectors'
import {toAPIParams, lowerCaseFieldValues} from 'data/personSearch'

const removeFalsy = (params) => {
  const newObj = {}
  Object.keys(params).forEach((prop) => {
    if (params[prop]) { newObj[prop] = params[prop] }
  })
  return newObj
}

const personSearchParams = (personSearchFields) => {
  if (!personSearchFields) { return {} }
  return {person_search_fields: lowerCaseFieldValues(removeFalsy(toAPIParams(personSearchFields)))}
}

const searchAfterParams = (sort) => (sort ? {search_after: sort} : {})

export function getPeopleEffect({isClientOnly, isAdvancedSearchOn, personSearchFields, size, sort}) {
  return call(get, '/api/v1/people', {
    is_client_only: isClientOnly,
    is_advanced_search_on: isAdvancedSearchOn,
    size: size,
    ...personSearchParams(personSearchFields),
    ...searchAfterParams(sort),
  })
}

export function* fetchPeopleSearch({payload: {isClientOnly, isAdvancedSearchOn, personSearchFields}}) {
  try {
    const TIME_TO_DEBOUNCE = 400
    yield call(delay, TIME_TO_DEBOUNCE)
    const size = yield select(selectSearchResultsCurrentRow)
    const response = yield getPeopleEffect({isClientOnly, isAdvancedSearchOn, personSearchFields, size})
    const staffId = yield select(getStaffIdSelector)
    yield put(fetchSuccess(response))
    yield call(logEvent, 'personSearch', {
      staffId: staffId,
      totalResults: response.hits.total,
    })
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchPeopleSearchSaga() {
  yield takeLatest(PEOPLE_SEARCH_FETCH, fetchPeopleSearch)
}
