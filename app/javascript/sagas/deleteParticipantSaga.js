import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  DELETE_PERSON,
  deletePersonSuccess,
  deletePersonFailure,
} from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationshipsByClientIds} from 'actions/relationshipsActions'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import {getClientIdsSelector} from 'selectors/clientSelectors'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'

export function* deleteParticipant({payload: {id}}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deletePersonSuccess(id))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchAllegations(screeningId))
    const clientIds = yield select(getClientIdsSelector)
    yield put(fetchRelationshipsByClientIds(clientIds))
    yield put(fetchHistoryOfInvolvements('screenings', screeningId))
  } catch (error) {
    yield put(deletePersonFailure(error.responseJSON))
  }
}
export function* deleteParticipantSaga() {
  yield takeEvery(DELETE_PERSON, deleteParticipant)
}
