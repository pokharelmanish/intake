import PropTypes from 'prop-types'
import React from 'react'
import {Button} from '@cwds/components'
import SavingButton from 'common/SavingButton'

const ActionRow = ({buttonText, isDisabled, isSaving, onCancel, onSave}) => (
  <div className='row'>
    <div className='col-md-12'>
      <div className='pull-right'>
        {!isSaving &&
          <Button onClick={onCancel}>Cancel</Button>}
        {isSaving ?
          <SavingButton text='Saving'/> :
          <Button
            primary
            disabled={isDisabled}
            onClick={onSave}
          >
            {buttonText}
          </Button>}
      </div>
    </div>
  </div>
)

ActionRow.defaultProps = {
  buttonText: 'Save',
  isDisabled: false,
}

ActionRow.propTypes = {
  buttonText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSaving: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default ActionRow
