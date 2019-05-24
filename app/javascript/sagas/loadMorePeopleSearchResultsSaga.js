import {takeEvery, put, select} from 'redux-saga/effects'
import {getPeopleEffect} from 'sagas/fetchPeopleSearchSaga'
import {selectLastResultsSortValue, selectSearchResultsCurrentRow} from 'selectors/peopleSearchSelectors'
import {
  LOAD_MORE_RESULTS,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'

export function* loadMorePeopleSearch({payload: {isClientOnly, isAdvancedSearchOn, personSearchFields}}) {
  try {
    const size = yield select(selectSearchResultsCurrentRow)
    const sort = yield select(selectLastResultsSortValue)
    const response = yield getPeopleEffect({isClientOnly, isAdvancedSearchOn, personSearchFields, size, sort})
    yield put(loadMoreResultsSuccess(response))
  } catch (error) {
    yield put(loadMoreResultsFailure(error))
  }
}

export function* loadMorePeopleSearchResultsSaga() {
  yield takeEvery(LOAD_MORE_RESULTS, loadMorePeopleSearch)
}
