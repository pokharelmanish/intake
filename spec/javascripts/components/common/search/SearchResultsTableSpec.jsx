import React from 'react'
import SearchResultsTable from 'common/search/SearchResultsTable'
import {mount} from 'enzyme'

const render = ({results = []} = {}) => {
  return mount(<SearchResultsTable results={results} />, {disableLifecycleMethods: true})
}

describe('SearchResultsTable', () => {
  const defaultMockedResults = [
    {
      'gender': 'female',
      'address': {
        'city': 'Lake Elsinore',
        'state': 'CA',
        'zip': '92530',
        'streetAddress': '4451 Anniversary Parkway',
        'type': 'Home',
      },
      'phoneNumber': {
        'number': '(923) 000-9928',
        'type': 'Home',
      },
      'dateOfBirth': '2005-01-03',
      'fullName': 'Sarah Timson',
    },
    {
      'gender': 'female',
      'clientCounties': [
        'Los Angeles',
      ],
      'address': null,
      'phoneNumber': null,
      'dateOfBirth': '1994-10-01',
      'fullName': 'c2 Bimson',
    },
    {
      'gender': 'unknown',
      'address': {
        'city': 'King City',
        'state': 'CA',
        'zip': '95662',
        'streetAddress': '456 Anhalt Terrace',
        'type': 'Home',
      },
      'phoneNumber': {
        'number': '(923) 000-9928',
        'type': 'Home',
      },
      'dateOfBirth': '1999-02-17',
      'fullName': 'Sally Mae Dibson',
    },
    {
      'gender': 'male',
      'address': null,
      'phoneNumber': null,
      'dateOfBirth': '1994-05-14',
      'fullName': 'Simon Donativo',
    },
    {
      'gender': 'male',
      'address': {
        'city': 'town',
        'state': 'CA',
        'zip': null,
        'streetAddress': '123 4th',
        'type': 'Placement Home',
      },
      'phoneNumber': null,
      'dateOfBirth': '1983-01-01',
      'fullName': 'First Gimson',
    },
  ]

  let component
  beforeEach(() => {
    component = render({results: defaultMockedResults})
  })

  describe('layout', () => {
    it('renders the table headers', () => {
      const header = component.find('div.rt-resizable-header-content')
      expect(header.at(0).text()).toEqual('')
      expect(header.at(1).text()).toEqual('Name')
      expect(header.at(2).text()).toEqual('Date of Birth')
      expect(header.at(3).text()).toEqual('Sex at Birth')
      expect(header.at(4).text()).toEqual('Service Provider County')
      expect(header.at(5).text()).toEqual('Service Provider Phone')
      expect(header.at(6).text()).toEqual('Address')
      expect(header.at(7).text()).toEqual('Case Status')
    })

    it('renders the correct number of rows', () => {
      const rows = component.find('div.rt-tr-group')
      expect(rows.length).toEqual(defaultMockedResults.length)
    })

    it('renders the table data', () => {
      const row = component.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td')
      expect(cell.at(0).text()).toEqual('1.')
      expect(cell.at(1).text()).toEqual('Sarah Timson')
      expect(cell.at(2).text()).toEqual('01/03/2005')
      expect(cell.at(3).text()).toEqual('Female')
      expect(cell.at(4).text()).toEqual('')
      expect(cell.at(5).text()).toEqual('')
      expect(cell.at(6).text()).toEqual('4451 Anniversary Parkway, Lake Elsinore, CA 92530')
      expect(cell.at(7).text()).toEqual('')
    })
  })
})
