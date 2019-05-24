import HistoryTable from 'views/history/HistoryTable'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryTable', () => {
  function renderHistoryTable({
    cases = [],
    referrals = [],
    screenings = [],
    onCopy = () => true,
  }) {
    const props = {cases, referrals, screenings, onCopy}
    return shallow(<HistoryTable {...props}/>, {disableLifecycleMethods: true})
  }

  describe('HistoryTable', () => {
    it('displays column headings', () => {
      const component = renderHistoryTable({})
      const columnHeadings = component.find('table > thead > tr').children()

      // For accessibility, empty column heading should not be a th
      expect(columnHeadings.at(0).name()).toEqual('td')
      expect(columnHeadings.at(0).text()).toEqual('')

      // Visible headings
      expect(columnHeadings.at(1).name()).toEqual('th')
      expect(columnHeadings.at(1).text()).toEqual('Date')
      expect(columnHeadings.at(2).name()).toEqual('th')
      expect(columnHeadings.at(2).text()).toEqual('Type/Status')
      expect(columnHeadings.at(3).name()).toEqual('th')
      expect(columnHeadings.at(3).text()).toEqual('County/Office')
      expect(columnHeadings.at(4).name()).toEqual('th')
      expect(columnHeadings.at(4).text()).toEqual('People and Roles')
    })

    it('displays a table body', () => {
      const component = renderHistoryTable({})
      expect(component.find('tbody').exists()).toEqual(true)
    })

    it('renders a view for every screening', () => {
      const component = renderHistoryTable({screenings: [{}]})
      expect(component.find('ScreeningView').length).toEqual(1)
    })

    it('assigns indices to screening children', () => {
      const component = renderHistoryTable({screenings: [{}, {}, {}]})
      const children = component.find('ScreeningView')
      expect(children.at(0).prop('index')).toEqual(1)
      expect(children.at(1).prop('index')).toEqual(2)
      expect(children.at(2).prop('index')).toEqual(3)
    })

    it('renders a view for every referral', () => {
      const component = renderHistoryTable({referrals: [{}, {}]})
      expect(component.find('ReferralView').length).toEqual(2)
    })

    it('assigns indices to referral children', () => {
      const component = renderHistoryTable({referrals: [{}, {}, {}]})
      const children = component.find('ReferralView')
      expect(children.at(0).prop('index')).toEqual(1)
      expect(children.at(1).prop('index')).toEqual(2)
      expect(children.at(2).prop('index')).toEqual(3)
    })

    it('renders a view for every case', () => {
      const component = renderHistoryTable({cases: [{}, {}, {}]})
      expect(component.find('CaseView').length).toEqual(3)
    })

    it('assigns indices to case children', () => {
      const component = renderHistoryTable({cases: [{}, {}, {}]})
      const children = component.find('CaseView')
      expect(children.at(0).prop('index')).toEqual(1)
      expect(children.at(1).prop('index')).toEqual(2)
      expect(children.at(2).prop('index')).toEqual(3)
    })

    it('resets indices for different types of children', () => {
      const component = renderHistoryTable({
        screenings: [{}],
        referrals: [{}],
        cases: [{}],
      })
      expect(component.find('CaseView').prop('index')).toEqual(1)
      expect(component.find('ScreeningView').prop('index')).toEqual(1)
      expect(component.find('ReferralView').prop('index')).toEqual(1)
    })

    describe('copy button', () => {
      it('renders', () => {
        const component = renderHistoryTable({})
        const copyButton = component.find('ClipboardButton')
        expect(copyButton.exists()).toEqual(true)
        expect(copyButton.props().children).toEqual('Copy History')
        expect(copyButton.props()['data-clipboard-target']).toBeDefined()
      })
    })
  })
})
