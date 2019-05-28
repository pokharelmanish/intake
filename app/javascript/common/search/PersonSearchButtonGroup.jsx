import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '@cwds/components'
import {PersonSearchFieldsDefaultProps} from 'data/personSearch'

const PersonSearchButtonGroup = ({
  onSubmit,
  onCancel,
  canSearch,
}) => (
  <div className="row person-search-button-group">
    <div className="col-md-12">
      {/* <button
        className="btn person-search-button search"
        onClick={onSubmit}
        disabled={!canSearch}
      >
        Search
      </button> */}
      <Button primary className="btn person-search-button search" onClick={onSubmit} disabled={!canSearch}>Search</Button>
      {/* <button
        className="btn person-search-button clear"
        onClick={onCancel}
      >
        Clear
      </button> */}
      <Button className="btn person-search-button clear" onClick={onCancel}>Clear</Button>
    </div>
  </div>
)

PersonSearchButtonGroup.propTypes = {
  canSearch: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

PersonSearchButtonGroup.defaultProps = PersonSearchFieldsDefaultProps

export default PersonSearchButtonGroup
