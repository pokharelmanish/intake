import {fromJS} from 'immutable'
import {
  setField,
  touchField,
  touchAllFields,
  resetFieldValues,
} from 'actions/incidentInformationFormActions'
import {
  fetchScreeningFailure,
  fetchScreeningSuccess,
} from 'actions/screeningActions'
import * as matchers from 'jasmine-immutable-matchers'
import incidentInformationFormReducer from 'reducers/incidentInformationFormReducer'

describe('incidentInformationFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns the current state on error', () => {
      const action = fetchScreeningFailure('error')
      const state = fromJS({
        location: {
          field: {
            value: 'original value',
            touched: true,
          },
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqual(state)
    })

    it('returns the new screening on success', () => {
      const screening = {
        incident_date: 'new incident date',
        incident_county: 'new incident county',
        incident_address: {
          id: '1',
          city: 'new city',
          state: 'new state',
          street_address: 'new street address',
          zip: 'new zip',
        },
        location_type: 'new location type',
        current_location_of_children: 'new location of children',
      }
      const state = fromJS({})
      const action = fetchScreeningSuccess(screening)
      const newState = fromJS({
        incident_date: {
          value: 'new incident date',
          touched: false,
        },
        incident_county: {
          value: 'new incident county',
          touched: false,
        },
        incident_address: {
          id: '1',
          city: {
            value: 'new city',
            touched: false,
          },
          state: {
            value: 'new state',
            touched: false,
          },
          street_address: {
            value: 'new street address',
            touched: false,
          },
          zip: {
            value: 'new zip',
            touched: false,
          },
        },
        location_type: {
          value: 'new location type',
          touched: false,
        },
        current_location_of_children: {
          value: 'new location of children',
          touched: false,
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqual(newState)
    })
  })

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the current state on error', () => {
      const action = fetchScreeningFailure('error')
      const state = fromJS({
        location: {
          field: {
            value: 'original value',
            touched: true,
          },
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqual(state)
    })

    it('returns the new screening on success', () => {
      const screening = {
        incident_date: 'new incident date',
        incident_county: 'new incident county',
        incident_address: {
          id: '1',
          city: 'new city',
          state: 'new state',
          street_address: 'new street address',
          zip: 'new zip',
        },
        location_type: 'new location type',
        current_location_of_children: 'new location of children',
      }
      const state = fromJS({})
      const action = fetchScreeningSuccess(screening)
      const newState = fromJS({
        incident_date: {
          value: 'new incident date',
          touched: false,
        },
        incident_county: {
          value: 'new incident county',
          touched: false,
        },
        incident_address: {
          id: '1',
          city: {
            value: 'new city',
            touched: false,
          },
          state: {
            value: 'new state',
            touched: false,
          },
          street_address: {
            value: 'new street address',
            touched: false,
          },
          zip: {
            value: 'new zip',
            touched: false,
          },
        },
        location_type: {
          value: 'new location type',
          touched: false,
        },
        current_location_of_children: {
          value: 'new location of children',
          touched: false,
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqual(newState)
    })
  })

  describe('on SET_INCIDENT_INFORMATION_FORM_FIELD', () => {
    it('returns an incidentInformationForm with the field updated to the new value', () => {
      const action = setField(['location', 'field'], 'new value')
      const state = fromJS({
        location: {
          field: {
            value: 'original value',
            touched: true,
          },
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqualImmutable(fromJS({
        location: {
          field: {
            value: 'new value',
            touched: true,
          },
        },
      }))
    })
  })
  describe('on TOUCH_ALL_INCIDENT_INFORMATION_FORM_FIELDS', () => {
    it('returns an incidentInformationForm with the fields updated to touched', () => {
      const action = touchAllFields()
      const state = fromJS({})
      expect(incidentInformationFormReducer(state, action)).toEqualImmutable(fromJS({
        incident_date: {
          touched: true,
        },
        incident_county: {
          touched: true,
        },
        incident_address: {
          street_address: {
            touched: true,
          },
          city: {
            touched: true,
          },
          state: {
            touched: true,
          },
          zip: {
            touched: true,
          },
        },
        location_type: {
          touched: true,
        },
        current_location_of_children: {
          touched: true,
        },
      }))
    })
  })
  describe('on TOUCH_INCIDENT_INFORMATION_FORM_FIELD', () => {
    it('returns an incidentInformationForm with a field touched', () => {
      const action = touchField(['incident_date'])
      const state = fromJS({
        incident_date: {
          touched: false,
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqualImmutable(fromJS({
        incident_date: {
          touched: true,
        },
      }))
    })

    it('can touch address fields', () => {
      const action = touchField(['incident_address', 'street_address'])
      const state = fromJS({
        incident_address: {
          street_address: {
            value: '123 Main St',
            touched: false,
          },
        },
      })
      expect(incidentInformationFormReducer(state, action)).toEqualImmutable(fromJS({
        incident_address: {
          street_address: {
            value: '123 Main St',
            touched: true,
          },
        },
      }))
    })
  })
  describe('on RESET_INCIDENT_INFORMATION_FORM_FIELDS', () => {
    it('returns an incidentInformationForm with the fields reset to their previous values', () => {
      const incidentInformationForm = {
        incident_date: {
          value: 'new date',
        },
        incident_county: {
          value: 'new county',
        },
        incident_address: {
          id: '1',
          street_address: {
            value: 'new street address',
          },
          city: {
            value: 'new city',
          },
          state: {
            value: 'new state',
          },
          zip: {
            value: 'new zip',
          },
        },
        location_type: {
          value: 'new location type',
        },
        current_location_of_children: {
          value: 'new current location of children',
        },
      }
      const screening = {
        incident_date: 'old date',
        incident_county: 'old county',
        incident_address: {
          id: '1',
          street_address: 'old street address',
          city: 'old city',
          state: 'old state',
          zip: 'old zip',
        },
        location_type: 'old location type',
        current_location_of_children: 'old location of children',
      }
      const action = resetFieldValues(screening)
      const state = fromJS(incidentInformationForm)
      expect(incidentInformationFormReducer(state, action)).toEqualImmutable(fromJS({
        incident_date: {
          value: 'old date',
        },
        incident_county: {
          value: 'old county',
        },
        incident_address: {
          id: '1',
          street_address: {
            value: 'old street address',
          },
          city: {
            value: 'old city',
          },
          state: {
            value: 'old state',
          },
          zip: {
            value: 'old zip',
          },
        },
        location_type: {
          value: 'old location type',
        },
        current_location_of_children: {
          value: 'old location of children',
        },
      }))
    })
  })
})
