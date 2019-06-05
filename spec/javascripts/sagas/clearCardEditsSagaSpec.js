import '@babel/polyfill'
import {takeEvery, put, select} from 'redux-saga/effects'
import {fromJS} from 'immutable'
import {clearCardEditsSaga, clearCardEdits} from 'sagas/clearCardEditsSaga'
import {clearCardEdits as clearEdits, CLEAR_CARD_EDITS} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {resetAllegations} from 'actions/allegationsFormActions'
import {cardName as allegationsCardName} from 'containers/screenings/AllegationsFormContainer'
import {resetFieldValues as resetScreeningInformationValues} from 'actions/screeningInformationFormActions'
import {cardName as screeningInformationCardName} from 'containers/screenings/ScreeningInformationFormContainer'
import {resetFieldValues as resetIncidentInformationValues} from 'actions/incidentInformationFormActions'
import {cardName as incidentInformationCardName} from 'containers/screenings/IncidentInformationFormContainer'
import {resetFieldValues as resetNarrativeFormValues} from 'actions/narrativeFormActions'
import {cardName as narrativeCardName} from 'containers/screenings/NarrativeFormContainer'
import {resetFieldValues as resetScreeningDecisionFormValues} from 'actions/screeningDecisionFormActions'
import {cardName as decisionCardName} from 'containers/screenings/DecisionFormContainer'
import {resetFieldValues as resetWorkerSafetyFormValues} from 'actions/workerSafetyFormActions'
import {cardName as workerSafetyCardName} from 'containers/screenings/WorkerSafetyFormContainer'
import {resetFieldValues as resetCrossReportFormValues} from 'actions/crossReportFormActions'

describe('clearCardEditsSaga', () => {
  it('clears card edits on CLEAR_CARD_EDITS', () => {
    const gen = clearCardEditsSaga()
    expect(gen.next().value).toEqual(takeEvery(CLEAR_CARD_EDITS, clearCardEdits))
  })
})
