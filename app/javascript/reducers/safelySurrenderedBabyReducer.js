import {fromJS} from 'immutable'
import {SET_PEOPLE_FORM_FIELD} from 'actions/peopleFormActions'
import {UPDATE_PERSON_COMPLETE} from 'actions/personCardActions'
import {
  FETCH_SSB_COMPLETE,
  SAVE_SSB_COMPLETE,
  SET_SSB_FIELD,
} from 'actions/safelySurrenderedBabyActions'
import {createReducer} from 'utils/createReducer'

const initialState = fromJS({
  persisted: {},
  form: {
    surrenderedBy: null,
    relationToChild: '1592',
    braceletId: '',
    parentGuardGivenBraceletId: 'unknown',
    parentGuardProvMedicalQuestionaire: 'unknown',
    comments: '',
    medQuestionaireReturnDate: '',
  },
})

export default createReducer(initialState, {
  [FETCH_SSB_COMPLETE]: (state, {payload, error}) => {
    if (error) { return state }
    return state
      .setIn(['persisted', 'participantChildId'], payload.participant_child_id)
      .setIn(['form', 'participantChildId'], payload.participant_child_id)
  },
  [SAVE_SSB_COMPLETE]: (state, {payload, error}) => {
    if (error) { return state }
    const immutablePayload = fromJS(payload)
    return state.set('persisted', immutablePayload).set('form', immutablePayload)
  },
  [SET_SSB_FIELD]: (state, {payload: {field, value}}) =>
    state.setIn(['form', field], value),
  [SET_PEOPLE_FORM_FIELD]: (state, {payload: {personId, fieldSet, value: roles}}) => {
    if (
      fieldSet[0] !== 'roles' ||
      state.getIn(['form', 'participantChildId']) ||
      !roles.includes('Victim')
    ) {
      return state
    }
    return state.setIn(['form', 'participantChildId'], personId)
  },
  [UPDATE_PERSON_COMPLETE]: (state, {payload: {person: {id, roles} = {}}, error}) => {
    if (error || !roles || !roles.includes('Perpetrator')) { return state }
    return state
      .setIn(['form', 'surrenderedBy'], id)
      .setIn(['persisted', 'surrenderedBy'], id)
  },
})
