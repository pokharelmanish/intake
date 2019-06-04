import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import {CardBody} from '@cwds/components'

const NarrativeShow = ({narrative, errors}) => (
  <CardBody>
    <div className='row'>
      <ShowField gridClassName='col-md-12' label='Report Narrative' errors={errors} required>
        {narrative}
      </ShowField>
    </div>
  </CardBody>
)

NarrativeShow.propTypes = {
  errors: PropTypes.array,
  narrative: PropTypes.string,
}

export default NarrativeShow
