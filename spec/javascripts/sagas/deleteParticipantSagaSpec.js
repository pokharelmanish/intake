import 'babel-polyfill'
import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSaga,
  deleteParticipant,
} from 'sagas/deleteParticipantSaga'
import {DELETE_PARTICIPANT} from 'actions/actionTypes'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {
  deleteParticipantSuccess,
  deleteParticipantFailure,
  fetchScreening,
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'

describe('deleteParticipantSaga', () => {
  it('deletes participant on DELETE_PARTICIPANT', () => {
    const gen = deleteParticipantSaga()
    expect(gen.next().value).toEqual(takeEvery(DELETE_PARTICIPANT, deleteParticipant))
  })
})

describe('deleteParticipant', () => {
  it('deletes and puts participant, fetches a screening, and fetches relationships', () => {
    const id = '123'
    const gen = deleteParticipant({id})
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.next().value).toEqual(
      put(deleteParticipantSuccess(id))
    )
    expect(gen.next().value).toEqual(select(getScreeningIdValueSelector))
    expect(gen.next('444').value).toEqual(
      put(fetchScreening('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(fetchRelationships('444'))
    )
    expect(gen.next('444').value).toEqual(
      put(fetchHistoryOfInvolvements('444'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const id = '123'
    const gen = deleteParticipant({id})
    expect(gen.next().value).toEqual(call(destroy, '/api/v1/participants/123'))
    expect(gen.throw(error).value).toEqual(
      put(deleteParticipantFailure('some error'))
    )
  })
})
