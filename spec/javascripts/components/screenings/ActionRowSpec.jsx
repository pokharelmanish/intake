import ActionRow from 'screenings/ActionRow'
import React from 'react'
import {shallow} from 'enzyme'

describe('ActionRow', () => {
  const render = ({onCancel = () => {}, onSave = () => {}, ...props} = {}) => (
    shallow(<ActionRow onCancel={onCancel} onSave={onSave} {...props} />)
  )

  describe('default', () => {
    it('renders a full row with cancel and save buttons pulled right', () => {
      const component = render()

      const row = component.find('.row .col-md-12 .pull-right')
      expect(row.exists()).toEqual(true)
      expect(row.find('Button').at(0).html()).toContain('Cancel')
      expect(row.find('Button').at(1).html()).toContain('Save')
    })

    it('calls onCancel when cancel button is clicked', () => {
      const onCancel = jasmine.createSpy('onCancel')
      const component = render({onCancel})
      const cancelButton = component.find('Button').at(0)

      cancelButton.simulate('click')
      expect(onCancel).toHaveBeenCalled()
    })

    it('calls onSave when save button is clicked', () => {
      const onSave = jasmine.createSpy('onSave')
      const component = render({onSave})
      const saveButton = component.find('Button').at(1)

      saveButton.simulate('click')
      expect(onSave).toHaveBeenCalled()
    })
  })

  describe('when isSaving', () => {
    it('renders a row with a Saving button and no Cancel button', () => {
      const component = render({isSaving: true})

      const row = component.find('.row .col-md-12 .pull-right')
      expect(row.exists()).toEqual(true)
      expect(row.find('SavingButton').exists()).toEqual(true)
      expect(row.find('SavingButton').props().text).toEqual('Saving')
      expect(row.find('button').length).toEqual(0)
    })

    it('does not call onSave again when saving button is clicked', () => {
      const onSave = jasmine.createSpy('onSave')
      const component = render({onSave, isSaving: true})
      const saveButton = component.find('SavingButton')

      expect(saveButton.props().onClick).not.toBeDefined()
    })
  })

  describe('when props are passed', () => {
    it('passes text props to the save button', () => {
      const component = render({buttonText: 'Save Relationship'})
      const row = component.find('.row .col-md-12 .pull-right')
      expect(row.find('Button').at(1).html()).toContain('Save Relationship')
    })

    it('passes isDisable props to the save button', () => {
      const component = render({isDisabled: true})
      const row = component.find('.row .col-md-12 .pull-right')
      expect(row.find('Button').at(1).prop('disabled')).toBe(true)
    })
  })
})
