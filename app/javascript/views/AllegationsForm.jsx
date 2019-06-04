import AlertErrorMessage from 'common/AlertErrorMessage'
import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import ActionRow from 'screenings/ActionRow'
import {CardBody} from '@cwds/reactstrap'

const AllegationsForm = ({
  alertErrorMessage,
  allegations,
  allegationTypes,
  isSaving,
  onCancel,
  onChange,
  onSave,
  required,
}) => (
  <CardBody>
    { alertErrorMessage && <AlertErrorMessage message={alertErrorMessage} /> }
    <div className='row'>
      <div className='col-md-12'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>Alleged Victim/Children</th>
              <th scope='col'>Alleged Perpetrator</th>
              <th scope='col'>Allegation(s){required && ' (Required)'}</th>
            </tr>
          </thead>
          <tbody>
            {allegations.map((allegation, index) => {
              const {victimName, victimId, perpetratorName, perpetratorId} = allegation
              return (
                <tr key={index}>
                  <td>{victimName}</td>
                  <td>{perpetratorName}</td>
                  <td>
                    <Select
                      options={allegationTypes}
                      value={allegation.allegationTypes.map((type) => ({value: type, label: type}))}
                      onChange={(selectedAllegationTypes) => onChange({
                        victimId,
                        perpetratorId,
                        allegationTypes: selectedAllegationTypes.map((type) => type.value),
                      })}
                      aria-label={`allegations ${victimName} ${perpetratorName}`}
                      inputProps={{id: `allegations_${victimId}_${perpetratorId}`}}
                      tabSelectsValue={false}
                      clearable={false}
                      placeholder=''
                      multi
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
    <ActionRow onCancel={onCancel} onSave={onSave} isSaving={isSaving} />
  </CardBody>
)

AllegationsForm.propTypes = {
  alertErrorMessage: PropTypes.string,
  allegationTypes: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  allegations: PropTypes.arrayOf(PropTypes.shape({
    victimName: PropTypes.string,
    victimId: PropTypes.string,
    perpetratorName: PropTypes.string,
    perpetrarorId: PropTypes.string,
    allegationTypes: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  isSaving: PropTypes.bool,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  required: PropTypes.bool,
}

export default AllegationsForm
