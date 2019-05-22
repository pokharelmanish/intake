import {HomePage} from 'views/homePage'
import React from 'react'
import {shallow} from 'enzyme'

describe('HomePage', () => {
  describe('when it is only snapshot enabled', () => {
    it('does not load the screenings or display the list', () => {
      const props = {snapshot: true, actions: {}}
      const homePage = shallow(<HomePage {...props}/>)
      expect(homePage.find('Connect(ScreeningsTable)').length).toBe(0)
    })
  })
  describe('when it is only hotline enabled', () => {
    it('loads the screenings and displays the list', () => {
      const props = {hotline: true, actions: {}}
      const homePage = shallow(<HomePage {...props}/>)
      expect(homePage.find('Connect(ScreeningsTable)').length).toBe(1)
    })
  })
  describe('when it is hotline and snapshot enabled', () => {
    it('loads the screenings and displays the list', () => {
      const props = {hotline: true, actions: {}}
      const homePage = shallow(<HomePage {...props}/>)
      expect(homePage.find('Connect(ScreeningsTable)').length).toBe(1)
    })
  })
})
