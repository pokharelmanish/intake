import React from 'react'
import {CardBody} from '@cwds/reactstrap'

const EmptyHistory = () => (
  <CardBody>
    <div className='row'>
      <div className='col-md-12 empty-relationships'>
        <div className='double-gap-top  centered'>
          <span className='c-dark-grey'>Search for people and add them to see their child welfare history.</span>
        </div>
      </div>
    </div>
  </CardBody>
)

export default EmptyHistory
