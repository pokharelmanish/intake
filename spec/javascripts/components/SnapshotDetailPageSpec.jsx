import React from 'react'
import {SnapshotDetailPage, mapDispatchToProps} from 'snapshots/SnapshotDetailPage'
import {shallow} from 'enzyme'
import {clearSnapshot, viewSnapshotSearch} from 'actions/snapshotActions'
import {clearPeople, createSnapshotPerson} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {clearRelationships} from 'actions/relationshipsActions'

const render = ({participants = [], params = {}, ...args}, disableLifecycleMethods = true) => {
  const props = {participants, params, ...args}
  return shallow(<SnapshotDetailPage {...props} />, {disableLifecycleMethods})
}

describe('SnapshotDetailPage', () => {
  describe('layout', () => {
    it('renders a person card for each participant', () => {
      const participants = [{id: '3'}, {id: '5'}]
      const page = render({participants})
      expect(page.find('PersonCardView').length).toEqual(2)
    })

    it('renders a RelationshipsCardContainer', () => {
      const page = render({})
      const relationshipsContainer = page.find('Connect(RelationshipsCard)')
      expect(relationshipsContainer.exists()).toBe(true)
    })

    it('renders history of involvement', () => {
      const page = render({})
      expect(page.find('Connect(HistoryOfInvolvement)').exists()).toBe(true)
    })
  })

  describe('event handlers', () => {
    // describe('when go back to results button is clicked', () => {
    //   it('calls goBackToResults', () => {
    //     const goBackToResults = jasmine.createSpy('goBackToResults')
    //     const page = render({goBackToResults})
    //     const header = page.find('Connect(PageHeader)')
    //     const goBackButton = header.props().button
    //     goBackButton.props.onClick()
    //     expect(goBackToResults).toHaveBeenCalled()
    //   })
    // })

    describe('when component mounts', () => {
      it('calls the clearSnapshot and createSnapshot Person', () => {
        const clearSnapshot = jasmine.createSpy('clearSnapshot')
        const createSnapshotPerson = jasmine.createSpy('createSnapshotPerson')
        render({params: {id: '1'}, clearSnapshot, createSnapshotPerson}, false)
        expect(clearSnapshot).toHaveBeenCalled()
        expect(createSnapshotPerson).toHaveBeenCalledWith('1')
      })
    })

    describe('when the component unmounts', () => {
      it('calls unmount', () => {
        const unmount = jasmine.createSpy('unmount')
        const page = render({unmount})
        page.unmount()
        expect(unmount).toHaveBeenCalled()
      })
    })
  })

  describe('mapDispatchToProps', () => {
    describe('clearSnapshot', () => {
      it('dispatches clearSnapshot action', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const props = mapDispatchToProps(dispatch)
        props.clearSnapshot()
        expect(dispatch).toHaveBeenCalledWith(clearSnapshot())
      })
    })

    describe('createSnapshotPerson', () => {
      it('dispatches createSnapshotPerson action', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const props = mapDispatchToProps(dispatch)
        props.createSnapshotPerson()
        expect(dispatch).toHaveBeenCalledWith(createSnapshotPerson())
      })
    })

    describe('goBackToResults', () => {
      it('dispatches viewSnapshotSearch action', () => {
        const dispatch = jasmine.createSpy('dispatch')
        const props = mapDispatchToProps(dispatch)
        props.goBackToResults()
        expect(dispatch).toHaveBeenCalledWith(viewSnapshotSearch())
      })
    })

    describe('unmount', async() => {
      const dispatch = jasmine.createSpy('dispatch')
      const props = mapDispatchToProps(dispatch)
      await props.unmount()
      expect(dispatch).toHaveBeenCalledWith(clearPeople())
      expect(dispatch).toHaveBeenCalledWith(clearHistoryOfInvolvement())
      expect(dispatch).toHaveBeenCalledWith(clearRelationships())
      expect(dispatch).toHaveBeenCalledWith(clearSnapshot())
    })
  })
})
