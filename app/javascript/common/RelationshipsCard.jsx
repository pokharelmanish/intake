import PropTypes from 'prop-types'
import React from 'react'
import {SHOW_MODE} from 'actions/snapshotActions'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsSnapshotContainer from 'containers/snapshot/RelationshipsContainer'
import CardView from 'views/CardView'

const RelationshipsCard = ({areRelationshipsEmpty}) => (
  <CardView
    id="relationships-card"
    title="Relationships"
    mode={SHOW_MODE}
    show={
      areRelationshipsEmpty ? (
        <EmptyRelationships />
      ) : (
        <RelationshipsSnapshotContainer />
      )
    }
  />
)

RelationshipsCard.propTypes = {
  areRelationshipsEmpty: PropTypes.bool,
}

export default RelationshipsCard
