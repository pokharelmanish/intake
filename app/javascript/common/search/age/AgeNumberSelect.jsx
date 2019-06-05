import React from 'react'
import PropTypes from 'prop-types'
import SelectField from 'common/SelectField'

class AgeNumberSelect extends React.Component {
  handleChange({target: {value}}) {
    const {range, onChange} = this.props
    const number = Number(value)
    onChange(
      'approximateAge',
      number >= range.min && number <= range.max ? value : ''
    )
  }

  render() {
    const {id, gridClassName, value, range, onKeyPress} = this.props
    const options = []
    for (let x = range.min; x <= range.max; x++) {
      const option = (<option key={x} value={x}>{x}</option>)
      options.push(option)
    }

    return (
      <SelectField
        id={id}
        gridClassName={gridClassName}
        label="Number"
        onChange={this.handleChange.bind(this)}
        value={value}
        onKeyPress={onKeyPress}
      >
        <option key="" />
        {options}
      </SelectField>
    )
  }
}

AgeNumberSelect.propTypes = {
  gridClassName: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  range: PropTypes.object.isRequired,
  value: PropTypes.string,
}

export default AgeNumberSelect
