import '@babel/polyfill'
import {takeEvery, put} from 'redux-saga/effects'
import {viewSnapshotSearch, viewSnapshotSearchSaga} from 'sagas/viewSnapshotSearchSaga'
import {VIEW_SNAPSHOT_SEARCH} from 'actions/actionTypes'
import {push} from 'react-router-redux'

describe('viewSnapshotSearchSaga', () => {
  it('calls viewSnapshotSearch on VIEW_SNAPSHOT_SEARCH action', () => {
    const generator = viewSnapshotSearchSaga()
    const sideEffect = takeEvery(VIEW_SNAPSHOT_SEARCH, viewSnapshotSearch)
    expect(generator.next().value).toEqual(sideEffect)
  })
})

describe('viewSnapshotSearch', () => {
  it('displays the snapshot search page', () => {
    const generator = viewSnapshotSearch()
    expect(generator.next().value).toEqual(put(push('/snapshot')))
  })
})
