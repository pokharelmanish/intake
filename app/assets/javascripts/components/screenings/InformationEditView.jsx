import React from 'react'
import COMMUNICATION_METHOD from 'CommunicationMethod'
import DateField from 'components/common/DateField'
import InputField from 'components/common/InputField'
import SelectField from 'components/common/SelectField'

const InformationEditView = ({screening, onChange}) => (
  <div className='card edit double-gap-top' id='screening-information-card'>
    <div className='card-header'>
      <span>Screening Information</span>
    </div>
    <div className='card-body'>
      <div className='row'>
        <InputField
          wrapperClassName='col-md-6'
          labelClassName='no-gap'
          id='name'
          label='Title/Name of Screening'
          placeholder='Enter name of the screening'
          value={screening.get('name') || ''}
          onChange={(event) => onChange(['name'], event.target.value)}
        />
      </div>
      <div className='row'>
        <DateField
          wrapperClassName='col-md-6'
          id='started_at'
          label='Screening Start Date/Time'
          value={screening.get('started_at') || ''}
          onChange={(event) => onChange(['started_at'], event.target.value)}
        />
        <DateField
          wrapperClassName='col-md-6'
          id='ended_at'
          label='Screening End Date/Time'
          value={screening.get('ended_at') || ''}
          onChange={(event) => onChange(['ended_at'], event.target.value)}
        />
        </div>
        <div className='row'>
          <SelectField
            wrapperClassName='col-md-6'
            id='communication_method'
            label='Communication Method'
            value={screening.get('communication_method') || ''}
            onChange={(event) => onChange(['communication_method'], event.target.value)}
          >
            <option key='' value=''></option>
            {Object.keys(COMMUNICATION_METHOD).map((item) => <option key={item} value={item}>{COMMUNICATION_METHOD[item]}</option>)}
          </SelectField>
      </div>
    </div>
  </div>
)

InformationEditView.propTypes = {
  screening: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
export default InformationEditView
