import React from 'react'
import {shallow} from 'enzyme'
import PersonSearchButtonGroup from 'common/search/PersonSearchButtonGroup'

const render = ({
  onCancel = () => {},
  onSubmit = () => {},
  canSearch = false,
} = {}) =>
  shallow(
    <PersonSearchButtonGroup
      onCancel={onCancel}
      onSubmit={onSubmit}
      canSearch={canSearch}
    />
  )

describe('PersonSearchButtonGroup', () => {
  it('renders the person-search-button-group row', () => {
    const component = render()
    const row = component.find('div.person-search-button-group.row')
    expect(row.exists()).toEqual(true)
  })

  it('renders search button', () => {
    const component = render()
    const searchButton = component.find('Button').at(1)
    expect(searchButton.html()).toContain('Search')
  })

  it('renders clear button', () => {
    const component = render()
    const clearButton = component.find('Button').at(0)
    expect(clearButton.html()).toContain('Clear')
  })

  it('calls onSubmit when search button is clicked', () => {
    const onSubmit = jasmine.createSpy('onClick')
    const component = render({onSubmit})
    const searchButton = component.find('Button').at(1)
    searchButton.simulate('click')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = render({onCancel})
    const cancelButton = component.find('Button').at(0)
    cancelButton.simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('search button gets enabled when canSearch props is true', () => {
    const component = render({canSearch: true})
    expect(component.find('Button').at(1).props().disabled).toBeFalsy()
  })

  it('search button gets disabled when canSearch props is false', () => {
    const component = render({canSearch: false})
    expect(component.find('Button').at(1).props().disabled).toBeTruthy()
  })
})
