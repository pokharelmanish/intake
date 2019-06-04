import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Input} from '@cwds/components'

class AgeUnitForm extends React.Component {
  handleClick({target: {value}}) {
    const {onChange, approximateAgeUnits} = this.props
    const unitsHaveChanged = value !== approximateAgeUnits
    if (unitsHaveChanged) {
      const isValidValue = value === 'months' || value === 'years'
      onChange('approximateAgeUnits', isValidValue ? value : '')
      onChange('approximateAge', '')
    }
  }

  renderRadioWithLabel({id, value, disabled, label, onKeyPress}) {
    const {approximateAgeUnits} = this.props
    return (
      <Fragment>
        <div className={id} onKeyPress={onKeyPress} role='presentation'>
          <Input
            checked={approximateAgeUnits === value}
            type="radio"
            name="age-unit"
            id={id}
            value={value}
            onClick={this.handleClick.bind(this)}
            disabled={disabled}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      </Fragment>
    )
  }

  render() {
    const {formLabel, monthsLabel, yearsLabel, onKeyPress} = this.props
    const monthsRadioProps = {
      id: 'age-unit-months',
      value: 'months',
      label: monthsLabel,
      onKeyPress: onKeyPress,
    }
    const yearsRadioProps = {
      id: 'age-unit-years',
      value: 'years',
      label: yearsLabel,
      onKeyPress: onKeyPress,
    }

    return (
      <Fragment>
        <label htmlFor="age-unit-form">{formLabel}</label>
        <form className="age-unit-form" name="age-unit-form">
          {this.renderRadioWithLabel(monthsRadioProps)}
          {this.renderRadioWithLabel(yearsRadioProps)}
        </form>
      </Fragment>
    )
  }
}

AgeUnitForm.propTypes = {
  approximateAgeUnits: PropTypes.string,
  formLabel: PropTypes.string.isRequired,
  monthsLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  yearsLabel: PropTypes.string.isRequired,
}

export default AgeUnitForm
