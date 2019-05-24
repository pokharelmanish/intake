import {takeEvery, put} from 'redux-saga/effects'
import {VIEW_SNAPSHOT_SEARCH} from 'actions/actionTypes'
import {push} from 'react-router-redux'

export function* viewSnapshotSearch() {
  yield put(push('/snapshot'))
}

export function* viewSnapshotSearchSaga() {
  yield takeEvery(VIEW_SNAPSHOT_SEARCH, viewSnapshotSearch)
}
