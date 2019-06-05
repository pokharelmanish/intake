import CardContainer from 'containers/screenings/CardContainer'
import React from 'react'

const CrossReportCard = () =>
  <CardContainer
    title='Cross Report'
    id='cross-report-card'
    show={<CrossReportShowContainer />}
  />

export default CrossReportCard
