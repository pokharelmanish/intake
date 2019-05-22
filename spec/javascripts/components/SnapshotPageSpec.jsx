import React from 'react'
import {SnapshotPage, mapDispatchToProps} from 'snapshots/SnapshotPage'
import {clear, resetPersonSearch} from 'actions/peopleSearchActions'
import {shallow} from 'enzyme'

describe('SnapshotPage', () => {
  const renderSnapshotPage = ({participants = [], ...args}) => {
    const props = {participants, ...args}
    return shallow(<SnapshotPage {...props} />, {disableLifecycleMethods: true})
  }
  it('renders a SnapshotIntro', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('SnapshotIntro').exists()).toEqual(true)
  })

  it('renders history of involvement', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(HistoryOfInvolvement)').exists()).toBe(true)
  })

  it('renders person search', () => {
    const snapshotPage = renderSnapshotPage({})
    expect(snapshotPage.find('Connect(PersonSearchForm)').exists()).toBe(true)
    expect(snapshotPage.find('Connect(PersonSearchForm)').props().isClientOnly).toBe(true)
  })

  it('renders a person card for each participant', () => {
    const snapshotPage = renderSnapshotPage({participants: [{id: '3'}, {id: '5'}]})
    expect(snapshotPage.find('PersonCardView').length).toEqual(2)
  })

  it('calls the unmount function when the component is unmounted', () => {
    const unmount = jasmine.createSpy('unmount')
    const snapshotPage = renderSnapshotPage({unmount})
    snapshotPage.unmount()
    expect(unmount).toHaveBeenCalled()
  })
})
