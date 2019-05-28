import React from 'react'
import {shallow} from 'enzyme'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'

describe('ScreeningCreateRelationship', () => {
  let onCancel
  let onSave
  let wrapper
  const candidates = [{
    person: {
      age: '20 yrs',
      dateOfBirth: '01/15/1986',
      id: '1',
      gender: 'Male',
      legacyId: '3',
      name: 'Gohan',
    },
    candidate: {
      age: '30 yrs',
      dateOfBirth: '11/11/1958',
      id: '4157',
      gender: 'Male',
      name: 'Goku',
    },
  }, {
    person: {
      age: '20 yrs',
      dateOfBirth: '01/15/1986',
      id: '1',
      gender: 'Male',
      legacyId: '3',
      name: 'Trunks',
    },
    candidate: {
      age: '40 yrs',
      dateOfBirth: '11/11/1968',
      id: '4158',
      gender: 'Male',
      name: 'Vegeta',
    },
  }]

  const props = {
    onChange: () => {},
    personId: '805',
    candidates: candidates,
    relationshipsButtonStatus: {createRelationshipsButtonStatus: true},
  }

  beforeEach(() => {
    onCancel = jasmine.createSpy('onCancel')
    onSave = jasmine.createSpy('onSave')
    wrapper = shallow(
      <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} />
    )
  })

  describe('Create Relationship button', () => {
    it('exists', () => {
      expect(wrapper.find('button').length).toBe(1)
      expect(wrapper.find('button').text()).toEqual('Create Relationship')
    })
    it('is enabled if createRelationshipsButtonStatus is true', () => {
      expect(wrapper.find('button').length).toBe(1)
      expect(wrapper.find('button').text()).toEqual('Create Relationship')
      expect(wrapper.find('button').props().disabled).toEqual(false)
    })
    const props1 = {...props,
      relationshipsButtonStatus: {createRelationshipsButtonStatus: false},
    }
    const wrapper1 = shallow(
      <ScreeningCreateRelationship {...props1} onCancel={onCancel} onSave={onSave}/>
    )
    it('is disabled if createRelationshipsButtonStatus is false', () => {
      expect(wrapper1.find('button').length).toBe(1)
      expect(wrapper1.find('button').text()).toEqual('Create Relationship')
      expect(wrapper1.find('button').props().disabled).toEqual(true)
    })
  })
  it('renders a ModalComponent only if the show state is set to true', () => {
    const afterRendering = wrapper.setState({show: true})
    expect(afterRendering.find('ModalComponent').length).toBe(1)
  })

  it('has two buttons on modalFooter only if the show state is set to true', () => {
    const afterRendering = wrapper.setState({show: true})
    const footer = shallow(afterRendering.find('ModalComponent').props().modalFooter)
    expect(footer.find('Button').length).toBe(2)
  })

  it('simulate a click on button and show modal', () => {
    wrapper.find('button').simulate('click')
    expect(wrapper.instance().state.show).toBe(true)
  })

  it('passes the props to CreateRelationshipForm', () => {
    wrapper.setState({show: true})
    const formComponent = wrapper.find('ModalComponent').props().modalBody
    expect(formComponent.props.candidates).toEqual(candidates)
  })

  describe('closeModal', () => {
    it('closes the modal and onCancel have been called', () => {
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const footerComponent = shallow(footer)
      const cancelButton = footerComponent.find('Button').at(0).props()
      expect(wrapper.state().show).toEqual(true)
      cancelButton.onClick()
      expect(wrapper.state().show).toEqual(false)
      expect(onCancel).toHaveBeenCalled()
      expect(onCancel).toHaveBeenCalledWith('805')
    })
  })

  describe('handleShowModal', () => {
    it('set the state show to its inverse', () => {
      wrapper.setState({show: true})
      expect(wrapper.state().show).toBe(true)
      wrapper.instance().handleShowModal()
      expect(wrapper.state().show).toEqual(false)
    })
  })

  describe('saveCreateRelationship', () => {
    it('doesnot close the modal and waits for the component to be updated when the Create Relationship Button is clicked', () => {
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const footerComponent = shallow(footer)
      const createRelationshipButton = footerComponent.find('Button').at(1).props()
      expect(wrapper.state().show).toEqual(true)
      createRelationshipButton.onClick()
      expect(wrapper.state().show).toEqual(true)
      expect(onSave).toHaveBeenCalled()
      expect(onSave).toHaveBeenCalledWith('805')
    })

    it('renders Create Relationship Button as disabled when the modal is popped up initially', () => {
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const createRelationshipButton = shallow(footer)
      expect(createRelationshipButton.find('Button').at(1).props().disabled).toBe(true)
    })

    it('renders only SavingButton if isSaving prop is set to True', () => {
      const wrapper = shallow(
        <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} isSaving = {true}/>
      )
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const savingButton = shallow(footer)
      expect(savingButton.find('SavingButton').length).toEqual(1)
    })

    it('has a SaveButton and has text prop in SavingButton as saving', () => {
      const wrapper = shallow(
        <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} isSaving={false} />
      )
      wrapper.setState({show: true})
      wrapper.setProps({isSaving: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const buttons = shallow(footer)
      expect(buttons.find('SavingButton').length).toEqual(1)
      expect(buttons.find('SavingButton').props().text).toEqual('Saving')
    })

    it('renders two buttons if isSaving prop is set to false', () => {
      const wrapper = shallow(
        <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} isSaving = {false}/>
      )
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const buttons = shallow(footer)
      expect(buttons.find('Button').length).toEqual(2)
    })

    it('closes the modal once isSaving prop updates to false', () => {
      const wrapper = shallow(
        <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} isSaving = {false}/>
      )
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const footerComponent = shallow(footer)
      const createRelationshipButton = footerComponent.find('Button').at(1).props()
      expect(wrapper.state().show).toEqual(true)
      createRelationshipButton.onClick()
      wrapper.setProps({isSaving: true})
      expect(wrapper.state().show).toEqual(true)
      wrapper.setProps({isSaving: false})
      expect(wrapper.state().show).toEqual(false)
    })

    it('calls hideModal function if isSaving prop is updated to false', () => {
      const wrapper = shallow(
        <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave} isSaving = {true}/>
      )
      const instance = wrapper.instance()
      wrapper.setState({show: true})
      spyOn(instance, 'hideModal')
      expect(instance.hideModal).not.toHaveBeenCalled()
      wrapper.setProps({isSaving: false})
      expect(instance.hideModal).toHaveBeenCalled()
    })
  })
})
