import React from 'react'
import {SnapshotPage} from 'snapshots/SnapshotPage'
import {shallow} from 'enzyme'
import * as IntakeConfig from 'common/config'

describe('SnapshotPage', () => {
  const render = ({participants = [], results = [], ...args}) => {
    const props = {participants, results, ...args}
    return shallow(<SnapshotPage {...props} />, {disableLifecycleMethods: true})
  }

  describe('SnapshotPage', () => {
    describe('layout', () => {
      beforeEach(() => {
        spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
        spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
      })
      it('renders person search', () => {
        const snapshotPage = render({})
        expect(snapshotPage.find('Connect(PersonSearchForm)').exists()).toBe(true)
        expect(snapshotPage.find('Connect(PersonSearchForm)').props().isClientOnly).toBe(true)
      })

      it('renders a PersonSearchResults if advanced search feature flag is on', () => {
        spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(true)
        const results = [{fullName: 'Sarah Timson'}]
        const snapshotPage = render({results: results})
        const personSearchResults = snapshotPage.find('Connect(PersonSearchResults)')
        expect(personSearchResults.exists()).toEqual(true)
      })

      it('does not render a PersonSearchResults if advanced search feature flag is off', () => {
        spyOn(IntakeConfig, 'isAdvancedSearchOn').and.returnValue(false)
        const results = [{fullName: 'Sarah Timson'}]
        const snapshotPage = render({results: results})
        const personSearchResults = snapshotPage.find('Connect(PersonSearchResults)')
        expect(personSearchResults.exists()).toEqual(false)
      })
      it('does not render PersonSearchResults when there are no results', () => {
        const snapshotPage = render({results: []})
        expect(snapshotPage.find('Connect(PersonSearchResults)').exists()).toBeFalsy()
      })
    })

    describe('event handlers', () => {
      describe('Person Search Form', () => {
        it('calls viewSnapshotDetail when a person is selected', () => {
          const person = {legacyDescriptor: {legacy_id: '1'}}
          const viewSnapshotDetail = jasmine.createSpy('viewSnapshotDetail')
          const snapshotPage = render({viewSnapshotDetail})
          const personSearchForm = snapshotPage.find('Connect(PersonSearchForm)')
          personSearchForm.props().onSelect(person)
          expect(viewSnapshotDetail).toHaveBeenCalledWith('1')
        })
      })
    })

    describe('mapDispatchToProps', () => {
      // describe('starting over', () => {
      //   it('clears search results and criteria', () => {
      //     const dispatch = jasmine.createSpy('dispatch')
      //     const props = mapDispatchToProps(dispatch)
      //     props.startOver()
      //     expect(dispatch).toHaveBeenCalledWith(clear('results'))
      //     expect(dispatch).toHaveBeenCalledWith(resetPersonSearch())
      //   })
      // })

      // describe('viewSnapshotDetail', () => {
      //   it('dispatches the viewSnapshotDetail action with id', () => {
      //     const dispatch = jasmine.createSpy('dispatch')
      //     const props = mapDispatchToProps(dispatch)
      //     props.viewSnapshotDetail('1')
      //     expect(dispatch).toHaveBeenCalledWith(viewSnapshotDetail('1'))
      //   })
      // })
    })
  })
})
