import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import AlertInfoMessage from 'common/AlertInfoMessage'
import ErrorMessages from 'common/ErrorMessages'
import {dateTimeFormatter} from 'utils/dateFormatter'
import {ALLEGATIONS_REQUIRE_CROSS_REPORTS_MESSAGE} from 'enums/CrossReport'
import {CardBody} from '@cwds/components'

const CrossReportShow = ({
  agencies,
  areCrossReportsRequired,
  communicationMethod,
  errors,
  hasAgencies,
  hasCrossReport,
  reportedOn,
}) => (
  <CardBody>
    { areCrossReportsRequired && <AlertInfoMessage message={ALLEGATIONS_REQUIRE_CROSS_REPORTS_MESSAGE} /> }
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='This report has cross reported to:' errors={errors.agencyRequired}>
        {
          hasCrossReport && hasAgencies &&
          <ul className='unstyled-list'>
            {
              Object.keys(agencies).map((type) => (
                <li key={type}>
                  {agencies[type]}
                  <ErrorMessages errors={errors[type]} />
                </li>
              ))
            }
          </ul>
        }
      </ShowField>
    </div>
    {
      hasCrossReport && hasAgencies &&
      <div className='row'>
        <ShowField
          gridClassName='col-md-6'
          label='Cross Reported on Date'
          required={hasCrossReport}
          errors={errors.informDate}
        >
          {dateTimeFormatter(reportedOn)}
        </ShowField>
        <ShowField
          gridClassName='col-md-6'
          label='Communication Method'
          required={hasCrossReport}
          errors={errors.method}
        >
          {communicationMethod}
        </ShowField>
      </div>
    }
  </CardBody>
)

CrossReportShow.propTypes = {
  agencies: PropTypes.object.isRequired,
  areCrossReportsRequired: PropTypes.bool.isRequired,
  communicationMethod: PropTypes.string,
  errors: PropTypes.object.isRequired,
  hasAgencies: PropTypes.bool.isRequired,
  hasCrossReport: PropTypes.bool.isRequired,
  reportedOn: PropTypes.string,
}

export default CrossReportShow
