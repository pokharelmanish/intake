import React from 'react'
import {SnapshotPage} from 'snapshots/SnapshotPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('SnapshotPage', () => {
  const renderSnapshotPage = ({participants = [], results = [], ...args}) => {
    const props = {participants, results, ...args}
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
