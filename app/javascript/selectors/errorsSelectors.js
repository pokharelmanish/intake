import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getErrors = (state) => state.get('errors', Map()).toIndexedSeq().flatten(true).toList()
export const getHasGenericErrorValueSelector = createSelector(
  getErrors,
  (errors) => (errors.size > 0)
)
export const getApiValidationErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.filter((error) => (error && error.get('type') === 'constraint_validation')))
)
export const getSystemErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.filter((error) => (error && error.get('type') !== 'constraint_validation')))
)
export const getScreeningSubmissionErrorsSelector = createSelector(
  getApiValidationErrorsSelector,
  (apiValidationErrors) => (
    apiValidationErrors.map((error) =>
      (`${error.get('property')} ${error.get('user_message')} (Ref #: ${error.get('incident_id')})`))
  )
)
export const getSystemErrorIncidentIdsSelector = createSelector(
  getSystemErrorsSelector,
  (systemErrors) => (systemErrors.map((error) => (error.get('incident_id'))).filter((item) => item))
)
export const getPageErrorMessageValueSelector = createSelector(
  getErrors,
  getSystemErrorIncidentIdsSelector,
  getApiValidationErrorsSelector,
  (errors, systemErrorIncidentIds, apiValidationErrors) => {
    if (apiValidationErrors.size) {
      return `${apiValidationErrors.size} error(s) have been identified. Please fix them and try submitting again.`
    } else if (errors.some((error) => error.get('friendly_message'))) {
      const error = errors.find((error) => error.get('friendly_message'))
      return `Something went wrong, sorry! ${error.get('friendly_message')}`
    } else {
      let message = 'Something went wrong, sorry! Please try your last action again.'
      if (systemErrorIncidentIds.size) {
        message += ` (Ref #: ${systemErrorIncidentIds.toJS().join(', ')})`
      }
      return message
    }
  }
)
