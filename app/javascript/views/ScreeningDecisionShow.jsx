import AlertErrorMessage from 'common/AlertErrorMessage'
import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import {CardBody} from '@cwds/components'

const ScreeningDecisionShow = ({
  alertErrorMessage,
  accessRestriction,
  additionalInformation,
  decision,
  decisionDetail,
  restrictionRationale,
  screeningContactReference,
  sdmPath,
  isAdditionalInfoRequired,
}) => (
  <CardBody>
    { alertErrorMessage && <AlertErrorMessage message={alertErrorMessage} /> }
    <div className='row'>
      <div className='col-md-6'>
        <ShowField label='Screening Decision' errors={decision.errors} required>
          {decision.value}
        </ShowField>
        <ShowField
          label={decisionDetail.label}
          required={decisionDetail.required}
          errors={decisionDetail.errors}
        >
          {decisionDetail.value}
        </ShowField>
        {(decision.value === 'Information to child welfare services' && screeningContactReference) &&
          <ShowField
            label='Case or Referral Id'
            errors={screeningContactReference.errors}
            required
          >
            {screeningContactReference.value}
          </ShowField>
        }
      </div>
      <div className='col-md-6'>
        <p className='double-gap-top'><strong>SDM Hotline Tool</strong></p>
        <div id='screening_decision'>Determine Decision and Response Time by using Structured Decision Making.</div>
        <a href={sdmPath} target='_blank' rel="noopener noreferrer" id='complete_sdm'>Complete SDM</a>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12'>
        <ShowField label='Additional Information' errors={additionalInformation.errors} required={isAdditionalInfoRequired}>
          {additionalInformation.value}
        </ShowField>
        {accessRestriction.value &&
          <ShowField label='Access Restrictions'>
            {accessRestriction.value}
          </ShowField>
        }
        {(accessRestriction.value || restrictionRationale.value) &&
          <ShowField label='Restrictions Rationale' errors={restrictionRationale.errors} required>
            {restrictionRationale.value}
          </ShowField>
        }
      </div>
    </div>
  </CardBody>
)

ScreeningDecisionShow.propTypes = {
  accessRestriction: PropTypes.shape({
    value: PropTypes.string,
  }),
  additionalInformation: PropTypes.shape({
    value: PropTypes.string,
  }),
  alertErrorMessage: PropTypes.string,
  decision: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
  }),
  decisionDetail: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.string,
  }),
  isAdditionalInfoRequired: PropTypes.bool,
  restrictionRationale: PropTypes.shape({
    value: PropTypes.string,
  }),
  screeningContactReference: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
  }),
  sdmPath: PropTypes.string,
}

export default ScreeningDecisionShow
