import {App} from 'common/app/App'
import React from 'react'
import {shallow, mount} from 'enzyme'
import * as IntakeConfig from 'common/config'
import {CaresProvider, Page} from '@cwds/components'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'

describe('App', () => {
  beforeEach(() => {
    spyOn(IntakeConfig, 'config').and.returnValue({base_path: 'intake'})
  })

  it('fetches user info when the component mounts', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
    const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}
    mount(<Provider store={store}><App actions={actions}><div/></App></Provider>)
    expect(fetchUserInfoAction).toHaveBeenCalled()
    expect(fetchSystemCodesAction).toHaveBeenCalled()
    expect(checkStaffPermission).toHaveBeenCalledWith('add_sensitive_people')
  })

  it('renders a ScrollToTop wrapper', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    const scrollToTop = app.find('withRouter(ScrollToTop)')
    expect(scrollToTop.exists()).toBe(true)
  })

  it('renders the Page component on all app views with layout and title as dashboard', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find(Page).exists()).toBe(true)
    expect(app.find('Page[layout="dashboard"]').exists()).toBe(true)
    expect(app.find('Page[title="Dashboard"]').exists()).toBe(true)
  })

  it('renders its children', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find('div').exists()).toBe(true)
  })

  it('renders the BreadCrumb', () => {
    const app = shallow(<App actions={{}}><div/></App>, {disableLifecycleMethods: true})
    expect(app.find(Page).exists()).toBe(true)
    expect(app.find('Page[Breadcrumb]').exists()).toBe(true)
  })
  it('renders a CaresProvider', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')

    const app = mount(<Provider store={store}><App actions={{fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}} fullName={''}><div /></App></Provider>)

    expect(app.find(CaresProvider).length).toEqual(1)
    expect(app.find('CaresProvider[Brand="CWS-CARES"]').exists()).toBe(true)
  })
  describe('App', () => {
    const fetchUserInfoAction = jasmine.createSpy('fetchUserInfoAction')
    const fetchSystemCodesAction = jasmine.createSpy('fetchSystemCodesAction')
    const checkStaffPermission = jasmine.createSpy('checkStaffPermission')
    const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission}
    it('displays the hotline button', () => {
      const props = {hotline: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.text()).toContain('Start Screening')
    })

    it('displays the snapshot button', () => {
      const props = {snapshot: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.text()).toContain('Start Snapshot')
    })

    it('when it is hotline and snapshot enabled it display snapshot button', () => {
      const props = {snapshot: true, hotline: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.find('#snapshot').text()).toContain('Start Snapshot')
    })

    it('when it is hotline and snapshot enabled it display hotline button', () => {
      const props = {snapshot: true, hotline: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.find('#screening').text()).toContain('Start Screening')
    })

    it('does not display the snapshot button', () => {
      const props = {hotline: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.text()).not.toContain('Start Snapshot')
    })

    it('does not display the hotline button', () => {
      const props = {snapshot: true, actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      expect(app.find(Page).exists()).toBe(true)
      const pageHeader = app.find('PageActions').find('button')
      expect(pageHeader.text()).not.toContain('Start Screening')
    })

    it('render a snapshot title', () => {
      spyOn(IntakeConfig, 'isSnapshot').and.returnValue(true)
      const props = {actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      console.log('app', app.debug())
      const pageTitle = app.find('PageTitle')
      expect(pageTitle.text()).toContain('Snapshot')
    })

    it('render a snapshot button', () => {
      spyOn(IntakeConfig, 'isSnapshot').and.returnValue(true)
      const props = {actions: actions}
      const app = mount(<Provider store={store}><App {...props}/></Provider>, {disableLifecycleMethods: true})
      const startOver = app.find('PageActions')
      expect(startOver.find('button').text()).toContain('Start Over')
    })
  })
})
