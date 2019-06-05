import React from 'react'
import {shallow} from 'enzyme'
import AgeUnitForm from 'common/search/age/AgeUnitForm'

const render = (
  {
    onChange = () => {},
    onKeyPress = () => {},
    approximateAgeUnits = '',
  } = {},
) => {
  const props = {
    formLabel: 'Unit',
    monthsLabel: 'Months',
    yearsLabel: 'Years',
    onChange,
    approximateAgeUnits,
    onKeyPress,
  }

  return shallow(<AgeUnitForm {...props} />)
}

describe('AgeUnitForm', () => {
  describe('layout', () => {
    it('renders a label for the form', () => {
      const component = render()
      const formLabel = component.find('label[htmlFor="age-unit-form"]')
      expect(formLabel.exists()).toEqual(true)
      expect(formLabel.text()).toEqual('Unit')
    })

    it('renders a form with props', () => {
      const component = render()
      const form = component.find('form')
      expect(form.exists()).toBe(true)
      expect(form.props().className).toEqual('age-unit-form')
      expect(form.props().name).toEqual('age-unit-form')
    })

    it('renders two rows', () => {
      const component = render()
      const columns = component.find('div')
      expect(columns.length).toEqual(2)
    })

    describe('months', () => {
      it('renders a radio button with props', () => {
        const component = render()
        const radioButton = component.find('Input#age-unit-months')
        expect(radioButton.exists()).toBe(true)
        expect(radioButton.props().type).toEqual('radio')
        expect(radioButton.props().name).toEqual('age-unit')
        expect(radioButton.props().id).toEqual('age-unit-months')
        expect(radioButton.props().value).toEqual('months')
        expect(typeof radioButton.props().onClick).toEqual('function')
        expect(radioButton.props().checked).toEqual(false)
      })

      it('renders a label for the radio button', () => {
        const component = render()
        const label = component.find('label[htmlFor="age-unit-months"]')
        expect(label.exists()).toEqual(true)
        expect(label.text()).toEqual('Months')
      })
    })

    describe('years', () => {
      it('renders a radio button with props', () => {
        const component = render()
        const radioButton = component.find('Input#age-unit-years')
        expect(radioButton.exists()).toEqual(true)
        expect(radioButton.props().type).toEqual('radio')
        expect(radioButton.props().name).toEqual('age-unit')
        expect(radioButton.props().id).toEqual('age-unit-years')
        expect(radioButton.props().value).toEqual('years')
        expect(typeof radioButton.props().onClick).toEqual('function')
        expect(radioButton.props().checked).toEqual(false)
      })

      it('renders a label for the radio button', () => {
        const component = render()
        const label = component.find('label[htmlFor="age-unit-years"]')
        expect(label.exists()).toEqual(true)
        expect(label.text()).toEqual('Years')
      })
    })

    describe('radio buttons', () => {
      describe('months radio button', () => {
        describe('is checked', () => {
          it('when the age unit value equals the radio value', () => {
            const component = render({approximateAgeUnits: 'months'})
            const radioButton = component.find('Input#age-unit-months')
            expect(radioButton.props().checked).toEqual(true)
          })
        })

        describe('is not checked', () => {
          it('when the age unit value does not equal the radio value', () => {
            const component = render({approximateAgeUnits: 'years'})
            const radioButton = component.find('Input#age-unit-months')
            expect(radioButton.props().checked).toEqual(false)
          })
        })

        describe('onEnter', () => {
          it('calls onKeyPress ', () => {
            const onKeyPress = jasmine.createSpy('onKeyPress')
            const component = render({onKeyPress})
            const radioButton = component.find('form div.age-unit-months')
            radioButton.simulate('keypress', {charCode: 13})
            expect(onKeyPress).toHaveBeenCalled()
          })
        })

        describe('onClick', () => {
          describe('when the radio button has not been selected', () => {
            it('calls onChange to store the age unit and approximate age', () => {
              const onChange = jasmine.createSpy('onChange')
              const component = render({onChange, approximateAgeUnits: 'years'})
              const radioButton = component.find('Input#age-unit-months')
              const target = {target: {value: 'months'}}
              radioButton.props().onClick(target)
              expect(onChange).toHaveBeenCalledWith('approximateAgeUnits', 'months')
              expect(onChange).toHaveBeenCalledWith('approximateAge', '')
              expect(onChange).toHaveBeenCalledTimes(2)
            })
          })

          describe('when the radio button is currently selected', () => {
            it('does not call onChange to store the age unit and approximate age', () => {
              const onChange = jasmine.createSpy('onChange')
              const component = render({onChange, approximateAgeUnits: 'months'})
              const radioButton = component.find('Input#age-unit-months')
              const target = {target: {value: 'months'}}
              radioButton.props().onClick(target)
              expect(onChange).not.toHaveBeenCalledWith('approximateAgeUnits', 'months')
              expect(onChange).not.toHaveBeenCalledWith('approximateAge', '')
              expect(onChange).toHaveBeenCalledTimes(0)
            })
          })
        })
      })

      describe('years radio button', () => {
        describe('is checked', () => {
          it('when the age unit value equals the radio value', () => {
            const component = render({approximateAgeUnits: 'years'})
            const radioButton = component.find('Input#age-unit-years')
            expect(radioButton.props().checked).toEqual(true)
          })
        })

        describe('is not checked', () => {
          it('when the age unit value does not equal the radio value', () => {
            const component = render({approximateAgeUnits: 'months'})
            const radioButton = component.find('Input#age-unit-years')
            expect(radioButton.props().checked).toEqual(false)
          })
        })

        describe('onClick', () => {
          describe('when the radio button has not been selected', () => {
            it('calls onChange to store the age unit and approximate age', () => {
              const onChange = jasmine.createSpy('onChange')
              const component = render({onChange, approximateAgeUnits: 'months'})
              const radioButton = component.find('Input#age-unit-years')
              const target = {target: {value: 'years'}}
              radioButton.props().onClick(target)
              expect(onChange).toHaveBeenCalledWith('approximateAgeUnits', 'years')
              expect(onChange).toHaveBeenCalledWith('approximateAge', '')
              expect(onChange).toHaveBeenCalledTimes(2)
            })
          })

          describe('when the radio button is currently selected', () => {
            it('does not call onChange to store the age unit and approximate age', () => {
              const onChange = jasmine.createSpy('onChange')
              const component = render({onChange, approximateAgeUnits: 'years'})
              const radioButton = component.find('Input#age-unit-years')
              const target = {target: {value: 'years'}}
              radioButton.props().onClick(target)
              expect(onChange).not.toHaveBeenCalledWith('approximateAgeUnits', 'years')
              expect(onChange).not.toHaveBeenCalledWith('approximateAge', '')
              expect(onChange).toHaveBeenCalledTimes(0)
            })
          })
        })
      })
    })
  })
})
