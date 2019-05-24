import {takeEvery, put} from 'redux-saga/effects'
import {VIEW_SNAPSHOT_DETAIL} from 'actions/actionTypes'
import {push} from 'react-router-redux'

export function* viewSnapshotDetail({payload: {id}}) {
  yield put(push(`/snapshot/detail/${id}`))
}

export function* viewSnapshotDetailSaga() {
  yield takeEvery(VIEW_SNAPSHOT_DETAIL, viewSnapshotDetail)
}
