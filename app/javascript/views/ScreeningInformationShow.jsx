import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import AlertInfoMessage from 'common/AlertInfoMessage'
import {SafelySurrenderedBabyMessage} from './ScreeningInformationHelpTextBox'
import {CardBody} from '@cwds/components'

const ScreeningInformationShow = ({name, assignee, report_type, started_at, ended_at, communication_method, errors}) => (
  <CardBody>
    { report_type === 'Safely Surrendered Baby' && <AlertInfoMessage message={<SafelySurrenderedBabyMessage/>} /> }
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Title/Name of Screening'>
        {name}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Assigned Social Worker' errors={errors.assignee} required>
        {assignee}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Report Type'>
        {report_type}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Screening Start Date/Time' errors={errors.started_at} required>
        {started_at}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Screening End Date/Time' errors={errors.ended_at}>
        {ended_at}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Communication Method' errors={errors.communication_method} required>
        {communication_method}
      </ShowField>
    </div>
  </CardBody>
)

ScreeningInformationShow.propTypes = {
  assignee: PropTypes.string,
  communication_method: PropTypes.string,
  ended_at: PropTypes.string,
  errors: PropTypes.object,
  name: PropTypes.string,
  report_type: PropTypes.string,
  started_at: PropTypes.string,
}

export default ScreeningInformationShow
