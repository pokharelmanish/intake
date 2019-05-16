import React from 'react'
import PropTypes from 'prop-types'
import ScreeningsTable from 'screenings/ScreeningsTableContainer'
import BreadCrumb from 'containers/common/BreadCrumb'

export const HomePage = ({hotline}) => (
  <div className='container'>
    <BreadCrumb />
    <div className='col-sm-12 gap-top homepage-container'>
      { hotline && <ScreeningsTable /> }
    </div>
  </div>
)

HomePage.propTypes = {
  actions: PropTypes.shape({
    createScreening: PropTypes.func,
    createSnapshot: PropTypes.func,
  }),
  hotline: PropTypes.bool,
  snapshot: PropTypes.bool,
}
