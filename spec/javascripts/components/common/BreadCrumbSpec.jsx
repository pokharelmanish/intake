import {BreadCrumb} from 'common/BreadCrumb'
import React from 'react'
import {shallow} from 'enzyme'

describe('BreadCrumb', () => {
  it("renders back to 'Dashboard' link", () => {
    const breadCrumb = shallow(
      <BreadCrumb />, {disableLifecycleMethods: true}
    )
    expect(breadCrumb.text()).toContain('Back to:')
    expect(breadCrumb.find('a').props().href).toEqual('/dashboard')
  })

  it('renders with a single node', () => {
    const props = [<a key='' href='/'>CaseLoad</a>]
    const breadCrumb = shallow(
      <BreadCrumb {...props} />, {disableLifecycleMethods: true}
    )
    expect(breadCrumb.text()).toContain('Back to:')
    expect(breadCrumb.find('a').length).toEqual(1)
  })

  it('uses container and back-to-dashboard-error classes with errors', () => {
    const breadCrumb = shallow(
      <BreadCrumb
        hasError={true}
      />
    )
    expect(breadCrumb.hasClass('container')).toEqual(true)
    expect(breadCrumb.hasClass('back-to-dashboard-error')).toEqual(true)
  })

  it('uses container and back-to-dashboard class without errors', () => {
    const breadCrumb = shallow(
      <BreadCrumb
        hasError={false}
      />
    )
    expect(breadCrumb.hasClass('container')).toEqual(true)
    expect(breadCrumb.hasClass('back-to-dashboard')).toEqual(true)
  })
})
