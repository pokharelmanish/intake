import React from 'react'
import {mount} from 'enzyme'
import BreadCrumb from 'containers/common/BreadCrumb'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'
import {fromJS} from 'immutable'
import {mapStateToProps} from 'containers/common/BreadCrumb'

describe('BreadCrumbContainer', () => {
  describe('mapStateToProps', () => {
    it('provides error status', () => {
      const state = fromJS({
        errors: ['an error'],
      })
      expect(mapStateToProps(state)).toEqual({
        hasError: true,
      })
    })

    it('provides non-error status', () => {
      const state = fromJS({
        errors: [],
      })
      expect(mapStateToProps(state)).toEqual({
        hasError: false,
      })
    })

    it('render the breadcrum in dashboard and snapshot', () => {
      const props = {isHotline: false}
      const app = mount(<Provider store={store}><BreadCrumb {...props}/></Provider>)
      expect(app.find('BreadcrumbItem').length).toEqual(1)
      expect(app.find('BreadcrumbItem').text()).toContain('Dashboard')
    })

    it('render the breadcrum', () => {
      const props = {isHotline: true}
      const app = mount(<Provider store={store}><BreadCrumb {...props}/></Provider>)
      expect(app.find('BreadcrumbItem').length).toEqual(2)
    })
  })
})
