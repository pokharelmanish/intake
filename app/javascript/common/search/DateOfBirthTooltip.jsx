import React from 'react'
import ReactTooltip from 'react-tooltip'

const DateOfBirthTooltip = () => {
  return (
    <div>
      <span>Date of Birth <i data-tip data-for='dob' className="fa fa-info-circle" aria-hidden="true"/></span>
      <ReactTooltip id='dob' aria-haspopup='true' className="custom-tool-tip">
        <span className='tooltip-content'>
          <p>Approximate DOB</p>
          <p>A tilde (~) indicates Date of Birth is <br/> approximate</p>
        </span>
      </ReactTooltip>
    </div>
  )
}

export default DateOfBirthTooltip
