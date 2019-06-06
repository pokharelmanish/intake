import DateOfBirthTooltip from 'common/search/DateOfBirthTooltip'
import React from 'react'
import {shallow} from 'enzyme'

describe('DateOfBirthTooltip', () => {
  const component = shallow(
    <DateOfBirthTooltip />, {disableLifecycleMethods: true}
  )

  it('renders DateOfBirthTooltip', () => {
    expect(component.exists()).toBe(true)
    expect(component.find('span').at(0).text()).toBe('Date of Birth ')
    expect(component.find('ReactTooltip').html()).toContain('A tilde (~) indicates Date of Birth is')
  })
})
