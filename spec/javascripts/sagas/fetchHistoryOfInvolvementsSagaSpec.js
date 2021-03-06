import '@babel/polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchHistoryOfInvolvementsSaga,
  fetchHistoryOfInvolvements,
} from 'sagas/fetchHistoryOfInvolvementsSaga'
import {FETCH_HISTORY_OF_INVOLVEMENTS} from 'actions/actionTypes'
import * as actions from 'actions/historyOfInvolvementActions'

describe('fetchHistoryOfInvolvementsSaga', () => {
  it('fetches involvements on FETCH_HISTORY_OF_INVOLVEMENTS', () => {
    const gen = fetchHistoryOfInvolvementsSaga()
    expect(gen.next().value).toEqual(
      takeLatest(FETCH_HISTORY_OF_INVOLVEMENTS, fetchHistoryOfInvolvements)
    )
  })
})

describe('fetchHistoryOfInvolvements', () => {
  const id = '123'
  const type = 'bananas'
  const action = actions.fetchHistoryOfInvolvements(type, id)

  it('should fetch and put involvements', () => {
    const gen = fetchHistoryOfInvolvements(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/bananas/123/history_of_involvements')
    )
    const involvements = [{id: '2'}]
    expect(gen.next(involvements).value).toEqual(
      put(actions.fetchHistoryOfInvolvementsSuccess(involvements))
    )
  })

  it('should put errors when errors are thrown', () => {
    const gen = fetchHistoryOfInvolvements(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/bananas/123/history_of_involvements')
    )
    const error = {responseJSON: 'some error'}
    expect(gen.throw(error).value).toEqual(
      put(actions.fetchHistoryOfInvolvementsFailure('some error'))
    )
  })

  it('should fetch by client_ids when provided', () => {
    const gen = fetchHistoryOfInvolvements(
      actions.fetchHistoryOfInvolvementsByClientIds(['ABC', '123'])
    )

    expect(gen.next().value).toEqual(
      call(get, '/api/v1/history_of_involvements?clientIds=ABC,123')
    )

    const hoi = {cases: ['a'], referrals: ['b'], screenings: ['c']}
    expect(gen.next(hoi).value).toEqual(
      put(actions.fetchHistoryOfInvolvementsSuccess(hoi))
    )
  })
})
