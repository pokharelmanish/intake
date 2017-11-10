import {fromJS, Map} from 'immutable'
import {
  getFilteredPersonRolesSelector,
  getPeopleWithEditsSelector,
  getPersonPhoneNumbersSelector,
  getPhoneNumberTypeOptions,
  getAddressTypeOptionsSelector,
  getPersonAddressesSelector,
  getStateOptionsSelector,
} from 'selectors/screening/peopleFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('peopleFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPeopleWithEditsSelector', () => {
    it('returns formated people object map', () => {
      const screening = {id: '123456'}
      const peopleForm = {
        one: {
          first_name: {value: 'one'},
          middle_name: {value: 'middle one'},
          last_name: {value: 'last one'},
          name_suffix: {value: 'suffix one'},
          phone_numbers: [
            {number: {value: '1234567890'}, type: {value: 'Home'}},
            {number: {value: '0987654321'}, type: {value: 'Cell'}},
          ],
          addresses: [
            {
              street: {value: '1234 Nowhere Lane'},
              city: {value: 'Somewhereville'},
              state: {value: 'CA'},
              zip: {value: '55555'},
              type: {value: 'Home'},
            }, {
              street: {value: '9674 Somewhere Street'},
              city: {value: 'Nowhereville'},
              state: {value: 'CA'},
              zip: {value: '55555'},
              type: {value: 'Cell'},
            },
          ],
          roles: {value: ['a', 'b']},
          ssn: {value: '123'},
        },
        two: {
          first_name: {value: 'two'},
          middle_name: {value: 'middle two'},
          last_name: {value: 'last two'},
          name_suffix: {value: 'suffix two'},
          phone_numbers: [{number: {value: null}, type: {value: null}}],
          addresses: [{
            street: {value: null},
            city: {value: null},
            state: {value: null},
            zip: {value: null},
            type: {value: null},
          }],
          roles: {value: ['c']},
          ssn: {value: '321'},
        },
        three: {
          first_name: {value: 'three'},
          middle_name: {value: 'middle three'},
          last_name: {value: 'last three'},
          name_suffix: {value: 'suffix three'},
          phone_numbers: [],
          addresses: [],
          roles: {value: []},
          ssn: {value: null},
        },
      }
      const state = fromJS({peopleForm, screening})
      expect(getPeopleWithEditsSelector(state)).toEqualImmutable(fromJS({
        one: {
          id: 'one',
          screening_id: '123456',
          first_name: 'one',
          middle_name: 'middle one',
          last_name: 'last one',
          name_suffix: 'suffix one',
          phone_numbers: [{number: '1234567890', type: 'Home'}, {number: '0987654321', type: 'Cell'}],
          addresses: [
            {street_address: '1234 Nowhere Lane', city: 'Somewhereville', state: 'CA', zip: '55555', type: 'Home'},
            {street_address: '9674 Somewhere Street', city: 'Nowhereville', state: 'CA', zip: '55555', type: 'Cell'},
          ],
          roles: ['a', 'b'],
          ssn: '123',
        },
        two: {
          id: 'two',
          screening_id: '123456',
          first_name: 'two',
          middle_name: 'middle two',
          last_name: 'last two',
          name_suffix: 'suffix two',
          phone_numbers: [{number: null, type: null}],
          addresses: [{street_address: null, city: null, state: null, zip: null, type: null}],
          roles: ['c'],
          ssn: '321',
        },
        three: {
          id: 'three',
          screening_id: '123456',
          first_name: 'three',
          middle_name: 'middle three',
          last_name: 'last three',
          name_suffix: 'suffix three',
          phone_numbers: [],
          addresses: [],
          roles: [],
          ssn: null,
        },
      }))
    })
  })
  describe('getFilteredPersonRolesSelector', () => {
    const personId = 'one'
    describe('when a reporter role is arleady selected', () => {
      const state = fromJS({
        peopleForm: {
          [personId]: {roles: {value: ['Mandated Reporter']}},
        },
      })
      it('returns all roles with reporter roles disabled', () => {
        expect(getFilteredPersonRolesSelector(state, personId)).toEqualImmutable(fromJS([
          {label: 'Victim', value: 'Victim', disabled: false},
          {label: 'Perpetrator', value: 'Perpetrator', disabled: false},
          {label: 'Family Member', value: 'Family Member', disabled: false},
          {label: 'Collateral', value: 'Collateral', disabled: false},
          {label: 'Mandated Reporter', value: 'Mandated Reporter', disabled: true},
          {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: true},
          {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: true},
        ]))
      })
    })
    describe('when no reporter roles are selected', () => {
      const state = fromJS({
        peopleForm: {
          [personId]: {roles: {value: ['Victim']}},
        },
      })
      it('returns all roles not disabled', () => {
        expect(getFilteredPersonRolesSelector(state, personId)).toEqualImmutable(fromJS([
          {label: 'Victim', value: 'Victim', disabled: false},
          {label: 'Perpetrator', value: 'Perpetrator', disabled: false},
          {label: 'Family Member', value: 'Family Member', disabled: false},
          {label: 'Collateral', value: 'Collateral', disabled: false},
          {label: 'Mandated Reporter', value: 'Mandated Reporter', disabled: false},
          {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: false},
          {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: false},
        ]))
      })
    })
  })

  describe('getPhoneNumberTypeOptions', () => {
    it('returns formatted options for phone types', () => {
      expect(getPhoneNumberTypeOptions()).toEqualImmutable(fromJS([
        {value: 'Cell', label: 'Cell'},
        {value: 'Work', label: 'Work'},
        {value: 'Home', label: 'Home'},
        {value: 'Other', label: 'Other'},
      ]))
    })
  })

  describe('getPersonFormattedPhoneNumbersSelector', () => {
    it('returns the phone numbers for the person with the passed id', () => {
      const peopleForm = {
        one: {phone_numbers: [{
          number: {value: '1234567890'},
          type: {value: 'Home'}},
        ]},
        two: {phone_numbers: [{
          number: {value: '0987654321'},
          type: {value: 'Cell'}},
        ]},
      }
      const state = fromJS({peopleForm})
      expect(getPersonPhoneNumbersSelector(state, 'one')).toEqualImmutable(fromJS(
        [{number: '1234567890', type: 'Home'}]
      ))
    })
  })

  describe('getAddressTypeOptionsSelector', () => {
    it('returns formatted options for phone types', () => {
      expect(getAddressTypeOptionsSelector()).toEqualImmutable(fromJS([
        {value: 'Common', label: 'Common'},
        {value: 'Day Care', label: 'Day Care'},
        {value: 'Home', label: 'Home'},
        {value: 'Homeless', label: 'Homeless'},
        {value: 'Other', label: 'Other'},
        {value: 'Penal Institution', label: 'Penal Institution'},
        {value: 'Permanent Mailing Address', label: 'Permanent Mailing Address'},
        {value: 'Residence 2', label: 'Residence 2'},
        {value: 'Work', label: 'Work'},
      ]))
    })
  })

  describe('getStateOptionsSelector', () => {
    it('returns formatted options for phone types', () => {
      expect(getStateOptionsSelector().first()).toEqualImmutable(Map({value: 'AL', label: 'Alabama'}))
      expect(getStateOptionsSelector().last()).toEqualImmutable(Map({value: 'WY', label: 'Wyoming'}))
    })
  })

  describe('getPersonAddressesSelector', () => {
    it('returns the addresses for the person with the passed id', () => {
      const peopleForm = {
        one: {addresses: [{
          street: {value: '1234 Nowhere Lane'},
          city: {value: 'Somewhereville'},
          state: {value: 'CA'},
          zip: {value: '55555'},
          type: {value: 'Home'},
        }]},
        two: {addresses: [{
          street: {value: '9674 Somewhere Street'},
          city: {value: 'Nowhereville'},
          state: {value: 'CA'},
          zip: {value: '55555'},
          type: {value: 'Cell'},
        }]},
      }
      const state = fromJS({peopleForm})
      expect(getPersonAddressesSelector(state, 'one')).toEqualImmutable(fromJS(
        [{
          street: '1234 Nowhere Lane',
          city: 'Somewhereville',
          state: 'CA',
          zip: '55555',
          type: 'Home',
        }]
      ))
    })
  })
})
