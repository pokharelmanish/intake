import PropTypes from 'prop-types'
import React from 'react'
import {CandidatesPropType} from 'data/candidates'

export const Relationships = ({
  editFormRelationship,
  errors,
  isInvalidForm,
  isSaving,
  isScreening,
  onClick,
  onChange,
  onEdit,
  onSave,
  participants = [],
  pendingPeople = [],
  people,
  relationshipsButtonStatus,
  screeningId,
}) => (
  <div className="card-body no-pad-top">
    {!isScreening &&
      people.map((person, index) => (
        <div className="row" key={index}>
          <div className="col-md-8 gap-top">
            <span className="person">{person.name}</span>
            {person.relationships.length > 0 && (
              <span>
                <strong> is the...</strong>
                <ul className="relationships">
                  {person.relationships.map((relationship, index) => (
                    <li key={index} className="gap-top person-relationship">
                      <strong className="relationship-type">{relationship.type}</strong> &nbsp; of{' '}
                      <span className="relationship-name">{relationship.name}</span>
                      {relationship.isSealed && (
                        <span className="information-flag search-result">
                          Sealed
                        </span>
                      )}
                      {relationship.isSensitive && (
                        <span className="information-flag search-result">
                          Sensitive
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </span>
            )}
            {person.relationships.length === 0 && (
              <strong className="relationships">
                {' '}
                has no known relationships
              </strong>
            )}
            <div id="relationships-list" />
          </div>
        </div>
      ))}
  </div>
)

Relationships.propTypes = {
  candidates: CandidatesPropType,
  editFormRelationship: PropTypes.shape({
    absent_parent_indicator: PropTypes.bool,
    client_id: PropTypes.string,
    end_date: PropTypes.string,
    id: PropTypes.string,
    relationship_type: PropTypes.number,
    relative_id: PropTypes.string,
    same_home_status: PropTypes.string,
    start_date: PropTypes.string,
  }),
  errors: PropTypes.shape({
    started_at: PropTypes.array,
  }),
  isInvalidForm: PropTypes.bool,
  isSaving: PropTypes.bool,
  isScreening: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.string),
  pendingPeople: PropTypes.arrayOf(PropTypes.string),
  people: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      relationships: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          type: PropTypes.string,
          secondaryRelationship: PropTypes.string,
          age: PropTypes.string,
        })
      ),
    })
  ),
  relationshipsButtonStatus: PropTypes.shape({
    createRelationshipsButtonStatus: PropTypes.bool,
  }),
  screeningId: PropTypes.string,
}

export const EmptyRelationships = () => (
  <div className="card-body no-pad-top">
    <div className="row">
      <div className="col-md-12 empty-relationships">
        <div className="double-gap-top  centered">
          <span className="c-dark-grey">
            Search for people and add them to see their relationships.
          </span>
        </div>
      </div>
    </div>
  </div>
)
