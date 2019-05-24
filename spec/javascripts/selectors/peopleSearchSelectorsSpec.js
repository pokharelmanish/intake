import * as matchers from 'jasmine-immutable-matchers'
import {fromJS, Map} from 'immutable'
import {RESIDENCE_TYPE} from 'enums/AddressType'
import {
  selectPeopleResults,
  selectLastResultsSortValue,
  selectStartTime,
  selectPersonCreatedAtTime,
  selectPersonSearchFields,
  selectAkaFullName,
  selectClientIdErrors,
  selectSsnErrors,
  selectDobErrors,
  selectCanSearch,
  selectSearchResultsSubset,
} from 'selectors/peopleSearchSelectors'
import Immutable from 'immutable'
import moment from 'moment'

describe('peopleSearchSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  const languages = [
    {code: '1', value: 'English'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Italian'},
  ]
  const ethnicityTypes = [
    {code: '1', value: 'European'},
    {code: '2', value: 'French'},
    {code: '3', value: 'Romanian'},
  ]
  const raceTypes = [
    {code: '1', value: 'Race 1'},
    {code: '2', value: 'Race 2'},
    {code: '3', value: 'Race 3'},
  ]
  const unableToDetermineCodes = [
    {code: 'A', value: 'Abandoned'},
    {code: 'I', value: 'Unknown'},
    {code: 'K', value: 'Unknown'},
  ]
  const hispanicOriginCodes = [
    {code: 'Y', value: 'yes'},
    {code: 'N', value: 'no'},
  ]
  const addressTypes = [{code: RESIDENCE_TYPE, value: 'address type'}]

  const counties = [
    {code: '999', value: 'SysCode Nowhere'},
    {code: '998', value: 'SysCode Places'},
  ]

  const systemCodes = {
    addressTypes,
    counties,
    ethnicityTypes,
    hispanicOriginCodes,
    languages,
    raceTypes,
    unableToDetermineCodes,
  }

  describe('selectLastResultsSortValue', () => {
    it('returns the last results sort attribute', () => {
      const peopleSearch = {
        results: [
          {
            sort: ['first_sort'],
          },
          {
            sort: ['other_sort'],
          },
          {
            sort: ['last_sort'],
          },
        ],
      }
      const state = fromJS({peopleSearch})
      const lastSort = selectLastResultsSortValue(state)
      expect(lastSort).toEqual(['last_sort'])
    })
  })

  describe('selectPeopleResults', () => {
    it('maps person search attributes to suggestion attributes', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              id: '1',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              addresses: [
                {
                  id: '1',
                  street_number: '234',
                  street_name: 'Fake Street',
                  city: 'Flushing',
                  state_code: 'state',
                  zip: '11344',
                  type: {id: RESIDENCE_TYPE},
                  phone_numbers: [
                    {
                      number: '2126666666',
                      type: 'Home',
                    },
                  ],
                },
              ],
              phone_numbers: [
                {
                  id: '2',
                  number: '9949076774',
                  type: 'Home',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults).toEqualImmutable(
        fromJS([
          {
            legacy_id: '1',
            fullName: 'Bart Jacqueline Simpson, MD',
            gender: 'female',
            akaFullName: null,
            legacyDescriptor: {
              legacy_ui_id: '123-456-789',
              legacy_table_description: 'Client',
            },
            languages: ['Italian', 'French'],
            races: [{race: 'Race 1', race_detail: 'European'}],
            ethnicity: {
              hispanic_latino_origin: 'yes',
              ethnicity_detail: ['Central American'],
            },
            dateOfBirth: '1990-02-13',
            isCsec: false,
            isDeceased: true,
            isProbationYouth: true,
            ssn: '123-45-6789',
            clientCounties: ['SysCode Nowhere', 'SysCode Places'],
            address: {
              city: 'Flushing',
              state: 'state',
              zip: '11344',
              type: 'address type',
              streetAddress: '234 Fake Street',
            },
            phoneNumber: {
              number: '(212) 666-6666',
              type: 'Home',
            },
            isSensitive: true,
            isSealed: false,
          },
        ])
      )
    })

    it('maps the first address and its phone number result to address and phone number', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              addresses: [
                {
                  id: '1',
                  street_number: '234',
                  street_name: 'Fake Street',
                  city: 'Flushing',
                  state_code: 'state',
                  zip: '11344',
                  type: {id: RESIDENCE_TYPE},
                  phone_numbers: [
                    {
                      number: '2125550123',
                      type: 'Home',
                    },
                  ],
                },
                {
                  id: '2',
                  street_number: '2',
                  street_name: 'Camden Crt',
                  city: 'Flushing',
                  state_code: 'state',
                  zip: '11222',
                  type: {id: RESIDENCE_TYPE},
                  phone_numbers: [
                    {
                      number: '1231231234',
                      type: 'Home',
                    },
                  ],
                },
              ],
              phone_numbers: [
                {
                  number: '9949076774',
                  type: 'Home',
                },
                {
                  number: '1112226774',
                  type: 'Work',
                },
              ],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'address'])).toEqualImmutable(
        Map({
          city: 'Flushing',
          state: 'state',
          zip: '11344',
          type: 'address type',
          streetAddress: '234 Fake Street',
        })
      )
      expect(peopleResults.getIn([0, 'phoneNumber'])).toEqualImmutable(
        Map({
          number: '(212) 555-0123',
          type: 'Home',
        })
      )
    })

    it('maps person search attributes when phone numbers and addresses are empty', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              phone_numbers: [],
              addresses: [],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'address'])).toEqual(null)
      expect(peopleResults.getIn([0, 'phoneNumber'])).toEqual(null)
    })

    it('never shows csec pill in search results', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              csec: [
                {start_date: '2018-01-01', end_date: '2018-02-02'},
                {start_date: '2018-01-01'},
              ],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'isCsec'])).toEqual(false)
    })

    it('does not flag csec status when the person has no csec items', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              csec: [],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'isCsec'])).toEqual(false)
    })

    it('does not flag csec status when the person has only ended csec items', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              csec: [
                {start_date: '2018-01-01', end_date: '2018-02-02'},
                {start_date: '2018-01-01', end_date: '2018-02-02'},
              ],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'isCsec'])).toEqual(false)
    })

    describe('when highlighting', () => {
      function personWithHighlights(highlight) {
        return {
          results: [
            {
              _source: {
                first_name: 'Bart',
                last_name: 'Simpson',
                date_of_birth: '1990-02-13',
                ssn: '123456789',
                addresses: [],
                phone_numbers: [],
              },
              highlight,
            },
          ],
        }
      }

      it('should use exact highlighted fields if available', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          last_name: ['Sim<em>pson</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>Bar</em>t',
            'Sim<em>pson</em>',
            '<em>123456789</em>',
            '<em>1990</em>',
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual(
          '<em>Bar</em>t Sim<em>pson</em>'
        )
        expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
        expect(peopleResults.getIn([0, 'dateOfBirth'])).toEqual(
          '<em>1990-02-13</em>'
        )
      })

      it('should use exact highlighted and suffixes should return empty for invalid suffixes', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          last_name: ['Sim<em>pson</em>'],
          name_suffix: ['<em>cccv</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>Bar</em>t',
            'Sim<em>pson</em>',
            '<em>123456789</em>',
            '<em>1990</em>',
            '<em>cccv</em>',
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual(
          '<em>Bar</em>t Sim<em>pson</em>'
        )
        expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
        expect(peopleResults.getIn([0, 'dateOfBirth'])).toEqual(
          '<em>1990-02-13</em>'
        )
      })

      it('should check autocomplete_search_bar if no exact first_name', () => {
        const peopleSearch = personWithHighlights({
          // first_name: (no exact first name)
          last_name: ['Sim<em>pson</em>'],
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>Bar</em>t',
            'Sim<em>pson</em>',
            '<em>123456789</em>',
            '<em>1990</em>',
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual(
          '<em>Bar</em>t Sim<em>pson</em>'
        )
      })

      it('should check autocomplete_search_bar if no exact last_name', () => {
        const peopleSearch = personWithHighlights({
          first_name: ['<em>Bar</em>t'],
          // last_name: (no exact last name)
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>Bar</em>t',
            'Sim<em>pson</em>',
            '<em>123456789</em>',
            '<em>1990</em>',
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual(
          '<em>Bar</em>t Sim<em>pson</em>'
        )
      })

      it('should find autocomplete fields in any order', () => {
        const peopleSearch = personWithHighlights({
          // first_name: (no exact first name)
          // last_name: (no exact last name)
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>123456789</em>',
            '<em>1990</em>',
            'Sim<em>pson</em>',
            '<em>Bar</em>t',
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual(
          '<em>Bar</em>t Sim<em>pson</em>'
        )
      })

      it('should use exact names if no highlight', () => {
        const peopleSearch = personWithHighlights({
          // first_name: (no first name matches)
          // last_name: (no last name matches)
          ssn: ['<em>123456789</em>'],
          searchable_date_of_birth: ['<em>1990</em>'],
          autocomplete_search_bar: [
            '<em>123456789</em>',
            '<em>1990</em>',
            // (no first name or last name matches)
          ],
        })

        const state = fromJS({
          peopleSearch,
          systemCodes,
        })
        const peopleResults = selectPeopleResults(state)
        expect(peopleResults.getIn([0, 'fullName'])).toEqual('Bart Simpson')
      })
    })

    it('formats ssn', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              ssn: '123456789',
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('123-45-6789')
    })

    it('formats highlighted ssn', () => {
      const peopleSearch = {
        results: [
          {
            _source: {
              ssn: '123456789',
            },
            highlight: {
              ssn: ['<em>123456789</em>'],
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      const peopleResults = selectPeopleResults(state)
      expect(peopleResults.getIn([0, 'ssn'])).toEqual('<em>123-45-6789</em>')
    })
  })

  describe('selectStartTime', () => {
    it('gets the start time when there is a start time', () => {
      const peopleSearch = {
        startTime: '10-10-2001',
      }
      const state = fromJS({peopleSearch})
      expect(selectStartTime(state)).toEqual('10-10-2001')
    })

    it('gets the start time when there is no start time', () => {
      const peopleSearch = {
        startTime: null,
      }
      const state = fromJS({peopleSearch})
      expect(selectStartTime(state)).toEqual(null)
    })
  })

  describe('selectPersonCreatedAtTime', () => {
    it('gets person created at time', () => {
      const relationshipsQueryCycleTime = [
        {
          personCreatedAtTime: 1534190832860,
        },
      ]
      const state = fromJS({relationshipsQueryCycleTime})
      expect(selectPersonCreatedAtTime(state)).toEqual(1534190832860)
    })
  })

  describe('selectPersonSearchFields', () => {
    it('gets the last name from the store', () => {
      const peopleSearch = {searchFields: {lastName: 'Flintstone'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.lastName).toEqual('Flintstone')
    })

    it('gets the first name from the store', () => {
      const peopleSearch = {searchFields: {firstName: 'Freddy'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.firstName).toEqual('Freddy')
    })

    it('gets the middle name from the store', () => {
      const peopleSearch = {searchFields: {middleName: 'Bedrock'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.middleName).toEqual('Bedrock')
    })

    it('gets the client id from the store', () => {
      const peopleSearch = {searchFields: {clientId: '1'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.clientId).toEqual('1')
    })

    it('gets the suffix from the store', () => {
      const peopleSearch = {searchFields: {suffix: 'Jr'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.suffix).toEqual('Jr')
    })

    it('gets the ssn from the store', () => {
      const peopleSearch = {searchFields: {ssn: '123456789'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.ssn).toEqual('123456789')
    })

    it('gets the date of birth from the store', () => {
      const peopleSearch = {searchFields: {dateOfBirth: '01/01/2000'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.dateOfBirth).toEqual('01/01/2000')
    })

    it('gets the approximate age from the store', () => {
      const peopleSearch = {searchFields: {approximateAge: '5'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.approximateAge).toEqual('5')
    })

    it('gets the approximate age units from the store', () => {
      const peopleSearch = {searchFields: {approximateAgeUnits: 'years'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.approximateAgeUnits).toEqual('years')
    })

    it('gets the sex at birth from the store', () => {
      const peopleSearch = {searchFields: {sexAtBirth: 'Female'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.sexAtBirth).toEqual('Female')
    })

    it('gets the selected address from the store', () => {
      const peopleSearch = {searchFields: {address: '123 Sunflower Way'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.address).toEqual('123 Sunflower Way')
    })

    it('gets the selected city from the store', () => {
      const peopleSearch = {searchFields: {city: 'Sweetwater'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.city).toEqual('Sweetwater')
    })

    it('gets the selected county from the store', () => {
      const peopleSearch = {searchFields: {county: 'Mariposa'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.county).toEqual('Mariposa')
    })

    it('gets the selected US state from the store', () => {
      const peopleSearch = {searchFields: {state: 'California'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.state).toEqual('California')
    })

    it('gets the selected country from the store', () => {
      const peopleSearch = {searchFields: {country: 'United States of America'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.country).toEqual('United States of America')
    })

    it('gets the selected zip code from the store', () => {
      const peopleSearch = {searchFields: {zipCode: '95695'}}
      const state = fromJS({peopleSearch})
      const searchFields = selectPersonSearchFields(state)
      expect(searchFields.zipCode).toEqual('95695')
    })
  })

  describe('selectAkaFullName', () => {
    it('return akaFullName and name_type when searchTerm match the akas', () => {
      const peopleSearch = {
        searchTerm: 'James Doolittle',
      }
      const akas = [
        {
          name_type: 'AKA',
          last_name: 'Doolittle',
          id: 'MYl4QKc0Ki',
          first_name: 'James',
        },
        {
          name_type: 'Doe',
          last_name: 'Howland',
          id: 'OiRrdgc0Ki',
          first_name: 'John',
        },
        {
          name_type: 'Doe',
          last_name: 'Fratelli',
          id: 'H3TYeHO0Ki',
          first_name: 'Gino',
        },
        {
          name_type: 'AKA',
          last_name: 'Hunley',
          id: 'ToGs5P40Ki',
          first_name: 'Alan',
        },
        {
          name_type: 'Legal',
          last_name: 'Aldrich',
          id: '7MqLPlO0Ki',
          middle_name: 'Allison',
          first_name: 'Billy',
        },
      ]
      const state = fromJS({peopleSearch})
      const result = Immutable.fromJS({akas})
      expect(selectAkaFullName(state, result)).toEqual(
        ' (AKA: James Doolittle)'
      )
    })

    it('return null when searchTerm does not match', () => {
      const peopleSearch = {
        searchTerm: 'xyzabcxyz',
      }
      const akas = [
        {
          name_type: 'AKA',
          last_name: 'Doolittle',
          id: 'MYl4QKc0Ki',
          first_name: 'James',
        },
        {
          name_type: 'Doe',
          last_name: 'Howland',
          id: 'OiRrdgc0Ki',
          first_name: 'John',
        },
        {
          name_type: 'Doe',
          last_name: 'Fratelli',
          id: 'H3TYeHO0Ki',
          first_name: 'Gino',
        },
        {
          name_type: 'AKA',
          last_name: 'Hunley',
          id: 'ToGs5P40Ki',
          first_name: 'Alan',
        },
        {
          name_type: 'Legal',
          last_name: 'Aldrich',
          id: '7MqLPlO0Ki',
          middle_name: 'Allison',
          first_name: 'Billy',
        },
      ]
      const state = fromJS({peopleSearch})
      const result = Immutable.fromJS({akas})
      expect(selectAkaFullName(state, result)).toEqual(null)
    })

    it('returns null when akas is empty array', () => {
      const peopleSearch = {
        searchTerm: 'John Doe',
      }
      const akas = []
      const state = fromJS({peopleSearch})
      const result = Immutable.fromJS({akas})
      expect(selectAkaFullName(state, result)).toEqual(null)
    })
  })

  describe('selectClientIdErrors', () => {
    describe('when the field error check is true', () => {
      it('does not return error message if clientId is 19 digits.', () => {
        const peopleSearch = {
          searchFields: {clientId: '1111-1111-1111-1111111'},
          errorCheckFields: {clientId: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectClientIdErrors(state)
        expect(errors).toEqual([])
      })

      it('returns error message if clientId is less than 19 digits', () => {
        const peopleSearch = {
          searchFields: {clientId: '1111-1111-1111-1______'},
          errorCheckFields: {clientId: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectClientIdErrors(state)
        expect(errors).toEqual(['Client Id number must be 19 digits long.'])
      })
    })

    describe('when the field error check is false', () => {
      it('does not return any errors', () => {
        const peopleSearch = {
          searchFields: {clientId: '1111-1111-1111-1______'},
          errorCheckFields: {clientId: false},
        }
        const state = fromJS({peopleSearch})
        const errors = selectClientIdErrors(state)
        expect(errors).toEqual([])
      })
    })
  })

  describe('selectSsnErrors', () => {
    describe('when the field error check is true', () => {
      it('does not return an error message if SSN is 9 digits', () => {
        const peopleSearch = {
          searchFields: {ssn: '123456789'},
          errorCheckFields: {ssn: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual([])
      })

      it('returns an error message if ssn is less than 9 digits', () => {
        const peopleSearch = {
          searchFields: {ssn: '12345'},
          errorCheckFields: {ssn: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual(['Social security number must be 9 digits long.'])
      })

      it('returns an error message if ssn starts with 9', () => {
        const peopleSearch = {
          searchFields: {ssn: '923456789'},
          errorCheckFields: {ssn: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual(['Social security number cannot begin with 9.'])
      })

      it('returns an error message if ssn starts with 666', () => {
        const peopleSearch = {
          searchFields: {ssn: '666456789'},
          errorCheckFields: {ssn: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual(['Social security number cannot begin with 666.'])
      })

      it('returns an error message if ssn has all 0s in a group', () => {
        const peopleSearch = {
          searchFields: {ssn: '123006789'},
          errorCheckFields: {ssn: true},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual(['Social security number cannot contain all 0s in a group.'])
      })
    })

    describe('when the field error check is false', () => {
      it('does not return any errors', () => {
        const peopleSearch = {
          searchFields: {ssn: '123006789'},
          errorCheckFields: {ssn: false},
        }
        const state = fromJS({peopleSearch})
        const errors = selectSsnErrors(state)
        expect(errors).toEqual([])
      })
    })
  })

  describe('selectDobErrors', () => {
    it('returns an error if date is in the future', () => {
      const tomorrow = moment().add(1, 'days').toISOString()
      const peopleSearch = {searchFields: {dateOfBirth: tomorrow}}
      const state = fromJS({peopleSearch})
      const errors = selectDobErrors(state)
      expect(errors).toEqual(['Please enter date as today or earlier.'])
    })

    it('returns no error if date is current', () => {
      const today = moment().toISOString()
      const peopleSearch = {searchFields: {dateOfBirth: today}}
      const state = fromJS({peopleSearch})
      const errors = selectDobErrors(state)
      expect(errors).toEqual([])
    })
  })

  describe('selectCanSearch', () => {
    describe('returns false', () => {
      it('when lastName, clientId, ssn, dateOfBirth are empty', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '', ssn: '', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(false)
      })

      it('when clientId is not 19 digits', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '1111-1111-1111', ssn: '', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(false)
      })

      it('when ssn is not 9 digits', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '', ssn: '123-4', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(false)
      })

      it('when date of birth is future date', () => {
        const tomorrow = moment().add(10, 'days').toISOString()
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '', ssn: '', dateOfBirth: tomorrow},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(false)
      })

      it('when ssn is 9 digits and clientId is not 19 digits ', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '1111', ssn: '123-45-6789', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(false)
      })
    })

    describe('returns true', () => {
      it('when lastName is at least 1 character', () => {
        const peopleSearch = {
          searchFields: {lastName: 'G', clientId: '', ssn: '', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(true)
      })

      it('when clientId is 19 digits and has no errors', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '1111-1111-1111-1111111', ssn: '', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(true)
      })

      it('when ssn is 9 digits and has no errors', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '', ssn: '123-45-6789', dateOfBirth: ''},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(true)
      })

      it('when date of birth is valid date and has no errors', () => {
        const peopleSearch = {
          searchFields: {lastName: '', clientId: '', ssn: '', dateOfBirth: '2019-04-01'},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(true)
      })

      it('when lastName has at least 1 character, clientId is 19 digits, ssn is 9 digits and date of birth is valid', () => {
        const peopleSearch = {
          searchFields: {lastName: 'Girish', clientId: '1111-1111-1111-1111111', ssn: '123-45-6789', dateOfBirth: '2019-04-01'},
          errorCheckFields: {clientId: true, ssn: true},
        }
        const state = fromJS({peopleSearch})
        expect(selectCanSearch(state)).toEqual(true)
      })
    })
  })

  describe('selectSearchResultsSubset', () => {
    it('return results subset', () => {
      const peopleSearch = {
        searchTableCurrentPage: 1,
        searchTableCurrentRow: 5,
        results: [
          {
            _source: {
              id: '1',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
          {
            _source: {
              id: '2',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
          {
            _source: {
              id: '3',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
          {
            _source: {
              id: '4',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
          {
            _source: {
              id: '5',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
          {
            _source: {
              id: '6',
              first_name: 'Bart',
              last_name: 'Simpson',
              middle_name: 'Jacqueline',
              name_suffix: 'md',
              gender: 'female',
              akas: [],
              languages: [{id: '3'}, {id: '2'}],
              race_ethnicity: {
                hispanic_origin_code: 'Y',
                hispanic_unable_to_determine_code: 'Y',
                race_codes: [{id: '1'}],
                hispanic_codes: [{description: 'Central American'}],
              },
              date_of_birth: '1990-02-13',
              date_of_death: '2000-02-18',
              ssn: '123456789',
              client_counties: [
                {
                  description: 'Nowhere',
                  id: '999',
                },
                {
                  description: 'Places',
                  id: '998',
                },
              ],
              legacy_descriptor: {
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client',
              },
              sensitivity_indicator: 'S',
              open_case_responsible_agency_code: 'P',
            },
          },
        ],
      }
      const state = fromJS({
        peopleSearch,
        systemCodes,
      })
      expect(selectSearchResultsSubset(state)).toEqual([
        {
          legacy_id: '1',
          fullName: 'Bart Jacqueline Simpson, MD',
          gender: 'female',
          akaFullName: null,
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [{race: 'Race 1', race_detail: 'European'}],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          address: null,
          phoneNumber: null,
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          isSensitive: true,
          isSealed: false,
        },
        {
          legacy_id: '2',
          fullName: 'Bart Jacqueline Simpson, MD',
          gender: 'female',
          akaFullName: null,
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [{race: 'Race 1', race_detail: 'European'}],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          address: null,
          phoneNumber: null,
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          isSensitive: true,
          isSealed: false,
        },
        {
          legacy_id: '3',
          fullName: 'Bart Jacqueline Simpson, MD',
          gender: 'female',
          akaFullName: null,
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [{race: 'Race 1', race_detail: 'European'}],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          address: null,
          phoneNumber: null,
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          isSensitive: true,
          isSealed: false,
        },
        {
          legacy_id: '4',
          fullName: 'Bart Jacqueline Simpson, MD',
          gender: 'female',
          akaFullName: null,
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [{race: 'Race 1', race_detail: 'European'}],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          address: null,
          phoneNumber: null,
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          isSensitive: true,
          isSealed: false,
        },
        {
          legacy_id: '5',
          fullName: 'Bart Jacqueline Simpson, MD',
          gender: 'female',
          akaFullName: null,
          legacyDescriptor: {
            legacy_ui_id: '123-456-789',
            legacy_table_description: 'Client',
          },
          languages: ['Italian', 'French'],
          races: [{race: 'Race 1', race_detail: 'European'}],
          ethnicity: {
            hispanic_latino_origin: 'yes',
            ethnicity_detail: ['Central American'],
          },
          address: null,
          phoneNumber: null,
          dateOfBirth: '1990-02-13',
          isCsec: false,
          isDeceased: true,
          isProbationYouth: true,
          ssn: '123-45-6789',
          clientCounties: ['SysCode Nowhere', 'SysCode Places'],
          isSensitive: true,
          isSealed: false,
        },
      ])
    })
  })
})
