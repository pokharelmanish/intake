import '@babel/polyfill'
import {takeEvery, put} from 'redux-saga/effects'
import {viewSnapshotDetail, viewSnapshotDetailSaga} from 'sagas/viewSnapshotDetailSaga'
import {VIEW_SNAPSHOT_DETAIL} from 'actions/actionTypes'
import {push} from 'react-router-redux'

describe('viewSnapshotDetailSaga', () => {
  it('views snapshot details on VIEW_SNAPSHOT_DETAIL action', () => {
    const generator = viewSnapshotDetailSaga()
    const sideEffect = takeEvery(VIEW_SNAPSHOT_DETAIL, viewSnapshotDetail)
    expect(generator.next().value).toEqual(sideEffect)
  })
})

describe('viewSnapshotDetail', () => {
  it('displays the snapshot detail page', () => {
    const payload = {payload: {id: '1'}}
    const generator = viewSnapshotDetail(payload)
    expect(generator.next().value).toEqual(put(push('/snapshot/detail/1')))
  })
})
