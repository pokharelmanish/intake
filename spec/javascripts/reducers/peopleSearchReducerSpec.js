import * as matchers from 'jasmine-immutable-matchers'
import {
  clear,
  fetchFailure,
  fetchSuccess,
  resetPersonSearch,
  search,
  setPersonSearchField,
  setFieldErrorCheck,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
  setSearchCurrentPage,
  setSearchCurrentRow,
} from 'actions/peopleSearchActions'
import {fetchSuccess as fetchUserInfoSuccess} from 'actions/userInfoActions'
import peopleSearchReducer from 'reducers/peopleSearchReducer'
import {Map, fromJS} from 'immutable'
import moment from 'moment'

describe('peopleSearchReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on PEOPLE_SEARCH_FETCH', () => {
    it('updates the total', () => {
      const action = search(true, true, {searchTerm: 'newSearchTerm'})
      expect(peopleSearchReducer(Map(), action)).toEqualImmutable(
        fromJS({
          total: null,
        })
      )
    })
  })

  describe('on PEOPLE_SEARCH_FETCH_COMPLETE', () => {
    const initialState = fromJS({
      searchFields: {
        searchTerm: 'newSearchTerm',
      },
      total: 0,
    })
    describe('on success', () => {
      const action = fetchSuccess({
        hits: {
          total: 2,
          hits: ['result_one', 'result_two'],
        },
      })
      it('updates search results with hits and sets the new total', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: 'newSearchTerm',
            },
            total: 2,
            results: ['result_one', 'result_two'],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = fetchFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          initialState
        )
      })
    })
  })

  describe('on PEOPLE_SEARCH_CLEAR', () => {
    describe('clear search results', () => {
      const action = clear('results')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'newSearchTerm',
        },
        total: 3,
        results: ['result_one', 'result_two', 'result_three'],
      })
      it('resets results, total, and startTime', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: 'newSearchTerm',
            },
            total: null,
            results: [],
            startTime: null,
          })
        )
      })
    })

    describe('clear age fields', () => {
      const action = clear('age')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'newSearchTerm',
          searchByAgeMethod: 'approximate',
          dateOfBirth: '1985/05/05',
          approximateAge: '120',
          approximateAgeUnits: 'years',
        },
        total: 1,
        results: ['result_one'],
      })
      it('resets the age fields back to default', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: 'newSearchTerm',
              searchByAgeMethod: 'dob',
              dateOfBirth: '',
              approximateAge: '',
              approximateAgeUnits: '',
            },
            total: 1,
            results: ['result_one'],
          })
        )
      })
    })

    describe('when the field is not "age" or "results"', () => {
      const action = clear('unknown')
      const initialState = fromJS({
        searchTerm: 'newSearchTerm',
        total: 1,
        results: ['result_one'],
        searchByAgeMethod: 'dob',
        dateOfBirth: '1985/05/05',
        approximateAge: '120',
        approximateAgeUnits: 'years',
      })
      it('does not clear results or age fields', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchTerm: 'newSearchTerm',
            total: 1,
            results: ['result_one'],
            searchByAgeMethod: 'dob',
            dateOfBirth: '1985/05/05',
            approximateAge: '120',
            approximateAgeUnits: 'years',
          })
        )
      })
    })
  })

  describe('on SET_SEARCH_FIELD', () => {
    describe('startTime', () => {
      const today = moment('2015-10-19').toDate()

      it('does not set the start time when it exists', () => {
        const action = setPersonSearchField('lastName', 'Doe')
        const initialState = fromJS({
          searchFields: {
            searchTerm: '',
            lastName: 'Flintstone',
          },
          total: 1,
          results: ['result_one'],
          startTime: today.toISOString(),
        })
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: '',
              lastName: 'Doe',
            },
            total: 1,
            results: ['result_one'],
            startTime: today.toISOString(),
          })
        )
      })

      it('sets the start time when the value is falsy', () => {
        const action = setPersonSearchField('lastName', 'Doe')
        const initialState = fromJS({
          searchFields: {
            searchTerm: 'searchTerm',
            lastName: 'Flintstone',
          },
          total: 1,
          results: ['result_one'],
        })
        jasmine.clock().mockDate(today)
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: 'searchTerm',
              lastName: 'Doe',
            },
            total: 1,
            results: ['result_one'],
            searchTableCurrentPage: 1,
            searchTableCurrentRow: 25,
            startTime: today.toISOString(),
          })
        )
        jasmine.clock().uninstall()
      })

      it('resets the start time when the start time is falsy and value is falsy', () => {
        const action = setPersonSearchField('lastName', '')
        const initialState = fromJS({
          searchFields: {
            searchTerm: '',
            lastName: '',
          },
          total: 0,
          results: [],
        })
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: '',
              lastName: '',
            },
            total: 0,
            results: [],
            startTime: null,
          })
        )
      })
    })

    it('sets the search term', () => {
      const action = setPersonSearchField('searchTerm', 'Annie Doe')
      const initialState = fromJS({
        searchFields: {searchTerm: ''},
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('searchTerm')).toEqual('Annie Doe')
    })

    it('sets the last name', () => {
      const action = setPersonSearchField('lastName', 'Doe')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          lastName: 'Flintstone',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('lastName')).toEqual('Doe')
    })

    it('sets the first name', () => {
      const action = setPersonSearchField('firstName', 'Jane')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          firstName: 'Freddy',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('firstName')).toEqual('Jane')
    })

    it('sets the middle name', () => {
      const action = setPersonSearchField('middleName', 'Bedrock')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          middleName: 'Joe',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('middleName')).toEqual('Bedrock')
    })

    it('sets the client id', () => {
      const action = setPersonSearchField('clientId', '1')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          clientId: '2',
        },
        total: 1,
        results: ['results_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('clientId')).toEqual('1')
    })

    it('sets the suffix', () => {
      const action = setPersonSearchField('suffix', 'Jr')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          suffix: 'Sr',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('suffix')).toEqual('Jr')
    })

    it('sets the ssn', () => {
      const action = setPersonSearchField('ssn', '123456789')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          ssn: '098765432',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('ssn')).toEqual('123456789')
    })

    it('sets the date of birth', () => {
      const action = setPersonSearchField('dateOfBirth', '01/01/2000')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          dateOfBirth: '12/01/1999',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('dateOfBirth')).toEqual('01/01/2000')
    })

    it('sets the approximate age', () => {
      const action = setPersonSearchField('approximateAge', '5')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          approximateAge: '3',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('approximateAge')).toEqual('5')
    })

    it('sets the approximate age units', () => {
      const action = setPersonSearchField('approximateAgeUnits', 'years')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          approximateAgeUnits: 'months',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('approximateAgeUnits')).toEqual('years')
    })

    it('sets the search by age method', () => {
      const action = setPersonSearchField('searchByAgeMethod', 'approximate')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          searchByAgeMethod: 'dob',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('searchByAgeMethod')).toEqual('approximate')
    })

    it('sets the sex at birth', () => {
      const action = setPersonSearchField('sexAtBirth', 'Female')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          sexAtBirth: 'Male',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('sexAtBirth')).toEqual('Female')
    })

    it('sets the address', () => {
      const action = setPersonSearchField('address', '123 Main St')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          address: '777 Cross St',
        },
        total: 3,
        results: ['result_one', 'result_two', 'result_three'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('address')).toEqual('123 Main St')
    })

    it('sets the city', () => {
      const action = setPersonSearchField('city', 'Sac Town')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          city: 'Sac Town',
        },
        total: 3,
        results: ['result_one', 'result_two', 'result_three'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('city')).toEqual('Sac Town')
    })

    it('sets the county', () => {
      const action = setPersonSearchField('county', 'Placer')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          county: 'Shasta',
        },
        total: 3,
        results: ['result_one', 'result_two', 'result_three'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('county')).toEqual('Placer')
    })

    it('sets the US state', () => {
      const action = setPersonSearchField('state', 'California')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          state: 'Florida',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('state')).toEqual('California')
    })

    it('sets the country', () => {
      const action = setPersonSearchField('country', 'United States of America')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          country: 'Mexico',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('country')).toEqual('United States of America')
    })

    it('sets the zip code', () => {
      const action = setPersonSearchField('zipCode', '95776')
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'searchTerm',
          zipCode: '95695',
        },
        total: 1,
        results: ['result_one'],
      })
      const searchFields = peopleSearchReducer(initialState, action).get('searchFields')
      expect(searchFields.get('zipCode')).toEqual('95776')
    })
  })

  describe('on LOAD_MORE_RESULTS_COMPLETE', () => {
    const initialState = fromJS({
      searchFields: {
        searchTerm: 'newSearchTerm',
      },
      total: 4,
      results: ['result_one', 'result_two'],
    })
    describe('on success', () => {
      const action = loadMoreResultsSuccess({
        hits: {
          hits: ['result_three', 'result_four'],
        },
      })
      it('updates search results with hits', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchFields: {
              searchTerm: 'newSearchTerm',
            },
            total: 4,
            results: [
              'result_one',
              'result_two',
              'result_three',
              'result_four',
            ],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = loadMoreResultsFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          initialState
        )
      })
    })
  })

  describe('on FETCH_USER_INFO_COMPLETE', () => {
    it('defaults the search county to the county of the user', () => {
      const action = fetchUserInfoSuccess({county: 'Los Angeles'})
      const initialState = fromJS({searchFields: {county: ''}})
      const newState = peopleSearchReducer(initialState, action)
      expect(newState.get('searchFields').get('county')).toEqual('Los Angeles')
      expect(newState.get('defaultCounty')).toEqual('Los Angeles')
    })
    it('does not override an explicit user selection', () => {
      const action = fetchUserInfoSuccess({county: 'Los Angeles'})
      const initialState = fromJS({searchFields: {county: 'Sutter'}})
      const newState = peopleSearchReducer(initialState, action)
      expect(newState.get('searchFields').get('county')).toEqual('Sutter')
      expect(newState.get('defaultCounty')).toEqual('Los Angeles')
    })
    it('does not set the default if user is State of California', () => {
      const action = fetchUserInfoSuccess({county: 'State of California'})
      const initialState = fromJS({
        searchFields: {county: ''},
        defaultCounty: null,
      })
      const newState = peopleSearchReducer(initialState, action)
      expect(newState.get('searchFields').get('county')).toEqual('')
      expect(newState.get('defaultCounty')).toEqual(null)
    })
  })

  describe('on RESET_PERSON_SEARCH', () => {
    it('clears everything and sets county to default', () => {
      const action = resetPersonSearch()
      const initialState = fromJS({
        searchFields: {
          searchTerm: 'Doe Jane Middle II 123456789 2019-02-14',
          lastName: 'Doe',
          firstName: 'Jane',
          middleName: 'Middle',
          clientId: '1',
          suffix: 'II',
          ssn: '123456789',
          dateOfBirth: '2019-02-14',
          approximateAge: '5',
          approximateAgeUnits: 'Years',
          searchByAgeMethod: 'approximate',
          sexAtBirth: 'Female',
          address: '123 Main St',
          city: 'Woodland',
          county: 'Yolo',
          state: 'California',
          country: 'United States of America',
          zipCode: '95695',
        },
        defaultCounty: 'Sacramento',
      })
      const newState = peopleSearchReducer(initialState, action)
      expect(newState).toEqualImmutable(
        fromJS({
          searchFields: {
            searchTerm: '',
            lastName: '',
            firstName: '',
            middleName: '',
            clientId: '',
            suffix: '',
            ssn: '',
            dateOfBirth: '',
            approximateAge: '',
            approximateAgeUnits: '',
            searchByAgeMethod: 'dob',
            sexAtBirth: '',
            address: '',
            city: '',
            county: 'Sacramento',
            state: '',
            country: '',
            zipCode: '',
          },
          defaultCounty: 'Sacramento',
        })
      )
    })
    it('sets county to empty if there is no default', () => {
      const action = resetPersonSearch()
      const initialState = fromJS({defaultCounty: null})
      const newState = peopleSearchReducer(initialState, action)
      expect(newState.get('searchFields').get('county')).toEqual('')
      expect(newState.get('defaultCounty')).toEqual(null)
    })
  })

  describe('on SET_SEARCH_FIELD_ERROR_CHECK', () => {
    describe('clientId', () => {
      it('action sets error check to true', () => {
        const action = setFieldErrorCheck('clientId', true)
        const initialState = fromJS({errorCheckFields: {clientId: false}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('clientId')).toEqual(true)
      })

      it('action sets error check to false', () => {
        const action = setFieldErrorCheck('clientId', false)
        const initialState = fromJS({errorCheckFields: {clientId: true}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('clientId')).toEqual(false)
      })
    })

    describe('ssn', () => {
      it('action sets error check to true', () => {
        const action = setFieldErrorCheck('ssn', true)
        const initialState = fromJS({errorCheckFields: {ssn: false}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('ssn')).toEqual(true)
      })

      it('action sets error check to false', () => {
        const action = setFieldErrorCheck('ssn', false)
        const initialState = fromJS({errorCheckFields: {ssn: true}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('ssn')).toEqual(false)
      })
    })

    describe('dateOfBirth', () => {
      it('action sets error check to true', () => {
        const action = setFieldErrorCheck('dateOfBirth', true)
        const initialState = fromJS({errorCheckFields: {dateOfBirth: false}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('dateOfBirth')).toEqual(true)
      })

      it('action sets error check to false', () => {
        const action = setFieldErrorCheck('dateOfBirth', false)
        const initialState = fromJS({errorCheckFields: {dateOfBirth: true}})
        const newState = peopleSearchReducer(initialState, action)
        expect(newState.get('errorCheckFields').get('dateOfBirth')).toEqual(false)
      })
    })
  })

  describe('on SET_SEARCH_CURRENT_PAGE', () => {
    const initialState = fromJS({
      searchTableCurrentPage: 1,
      searchFields: {
        searchTerm: 'newSearchTerm',
      },
    })
    const currentPage = 2
    const action = setSearchCurrentPage(currentPage)
    it('set the current page', () => {
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(fromJS({
        searchTableCurrentPage: currentPage,
        searchFields: {
          searchTerm: 'newSearchTerm',
        },
      }))
    })
  })

  describe('on SET_SEARCH_CURRENT_ROW', () => {
    const initialState = fromJS({
      searchTableCurrentRow: 25,
      searchFields: {
        searchTerm: 'newSearchTerm',
      },
    })
    const currentRow = 10
    const action = setSearchCurrentRow(currentRow)
    it('set the current row', () => {
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(fromJS({
        searchTableCurrentRow: currentRow,
        searchFields: {
          searchTerm: 'newSearchTerm',
        },
      }))
    })
  })
})
