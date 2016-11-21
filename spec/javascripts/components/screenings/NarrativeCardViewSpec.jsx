import Immutable from 'immutable'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import React from 'react'
import {mount} from 'enzyme'

describe('NarrativeCardView', () => {
  let wrapper
  const props = {
    screening: Immutable.fromJS({
      report_narrative: 'This is my narrative',
    })
  }

  describe('when the mode is set to edit', () => {
    it('renders the edit view', () => {
      wrapper = mount(<NarrativeCardView {...props} mode='edit'/>)
      expect(wrapper.find('NarrativeEditView').length).toEqual(1)
    })
  })

  describe('when the mode is set to show', () => {
    beforeEach(() => {
      wrapper = mount(<NarrativeCardView {...props} mode='show'/>)
    })

    it('renders the show view', () => {
      expect(wrapper.find('NarrativeShowView').length).toEqual(1)
    })

    describe("and a user clicks 'Edit narrative'", () => {
      beforeEach(() => {
        const editLink = wrapper.find('a[aria-label="Edit narrative"]')
        editLink.simulate('click')
      })

      it('the narrative edit view is rendered', () => {
        expect(wrapper.find('NarrativeEditView').length).toEqual(1)
      })
    })
  })
})
