import React from 'react'
import SearchResultsTable from 'common/search/SearchResultsTable'
import {mount} from 'enzyme'
import ReactTooltip from 'react-tooltip'

const render = (
  {
    resultsSubset = [],
    setCurrentPageNumber = () => {},
    setCurrentRowNumber = () => {},
    onLoadMoreResults = () => {},
    personSearchFields = {},
    currentRow = 25,
  } = {}) => {
  return mount(
    <SearchResultsTable
      resultsSubset={resultsSubset}
      setCurrentPageNumber={setCurrentPageNumber}
      setCurrentRowNumber={setCurrentRowNumber}
      onLoadMoreResults={onLoadMoreResults}
      personSearchFields={personSearchFields}
      currentRow={currentRow}
    />, {disableLifecycleMethods: true})
}

describe('SearchResultsTable', () => {
  const defaultMockedResults = [
    {
      'gender': 'female',
      'caseStatus': 'Closed',
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
      'isSealed': true,
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
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
      'isSensitive': true,
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
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
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
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
      'address': null,
      'phoneNumber': null,
      'dateOfBirth': '1994-05-14',
      'fullName': 'Simon Donativo',
    },
    {
      'gender': 'male',
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
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
    {
      'gender': 'male',
      'spCounty': 'pokhara',
      'spPhone': '111-111-1111',
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
    component = render({resultsSubset: defaultMockedResults})
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
      expect(cell.at(1).find('a').text()).toEqual('Sarah Timson')
      expect(cell.at(2).text()).toEqual('01/03/2005')
      expect(cell.at(3).text()).toEqual('Female')
      expect(cell.at(4).text()).toEqual('pokhara')
      expect(cell.at(5).text()).toEqual('(111) 111-1111')
      expect(cell.at(6).text()).toEqual('4451 Anniversary Parkway, Lake Elsinore, CA 92530')
      expect(cell.at(7).text()).toEqual('Closed')
    })
  })

  describe('onPageChange', () => {
    it('calls setCurrentPageNumber', () => {
      const setCurrentPageNumber = jasmine.createSpy('setCurrentPageNumber')
      const component = render({resultsSubset: defaultMockedResults, setCurrentPageNumber})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageChange(1)
      expect(setCurrentPageNumber).toHaveBeenCalledWith(2)
    })

    it('calls onLoadMoreResults', () => {
      const onLoadMoreResults = jasmine.createSpy('onLoadMoreResults')
      const personSearchFields = {lastName: 'laure'}
      const component = render({resultsSubset: defaultMockedResults, onLoadMoreResults, personSearchFields})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageChange(1)
      expect(onLoadMoreResults).toHaveBeenCalledWith({lastName: 'laure'})
    })

    it('doesnot call onLoadMoreResults when currentPage is less than previousPage', () => {
      const onLoadMoreResults = jasmine.createSpy('onLoadMoreResults')
      const personSearchFields = {lastName: 'laure'}
      const component = render({resultsSubset: defaultMockedResults, onLoadMoreResults, personSearchFields})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageChange(-2)
      expect(onLoadMoreResults).not.toHaveBeenCalledWith({lastName: 'laure'})
    })
  })

  describe('onPageSizeChange', () => {
    it('calls setCurrentRowNumber', () => {
      const setCurrentRowNumber = jasmine.createSpy('setCurrentRowNumber')
      const component = render({resultsSubset: defaultMockedResults, setCurrentRowNumber})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageSizeChange(5, 1)
      expect(setCurrentRowNumber).toHaveBeenCalledWith(5)
    })

    it('calls setCurrentRowNumber with currentPage', () => {
      const setCurrentPageNumber = jasmine.createSpy('setCurrentPageNumber')
      const component = render({resultsSubset: defaultMockedResults, setCurrentPageNumber})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageSizeChange(5, 1)
      expect(setCurrentPageNumber).toHaveBeenCalledWith(2)
    })

    it('calls onLoadMoreResults', () => {
      const onLoadMoreResults = jasmine.createSpy('onLoadMoreResults')
      const personSearchFields = {lastName: 'laure'}
      const component = render({resultsSubset: defaultMockedResults, onLoadMoreResults, personSearchFields})
      const searchResultsTable = component.find('ReactTable')
      searchResultsTable.props().onPageSizeChange(5, 1)
      expect(onLoadMoreResults).toHaveBeenCalledWith({lastName: 'laure'})
    })
  })

  describe('Sealed', () => {
    it('renders Link', () => {
      const row = component.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td')
      expect(cell.find('Link').exists()).toBe(true)
    })

    it('render client with tooltip', () => {
      const row = component.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td')
      expect(cell.find('span').html()).toContain('Sealed')
      expect(cell.find('span i').exists()).toBe(true)
    })
  })

  describe('Sensitive', () => {
    it('render client with tooltip', () => {
      const row = component.find('div.rt-tr-group').at(1)
      const cell = row.find('div.rt-td')
      expect(cell.find('span').html()).toContain('Sensitive')
      expect(cell.find('span i').exists()).toBe(true)
    })
  })

  describe('ComponentDidUpdate', () => {
    it('rebuild reacttooltip', () => {
      const rebuild = spyOn(ReactTooltip, 'rebuild')
      const currentRow = 10
      component.setProps({currentRow: currentRow})
      expect(rebuild).toHaveBeenCalled()
    })
  })
})
