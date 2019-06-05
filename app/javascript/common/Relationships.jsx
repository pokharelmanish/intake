import PropTypes from 'prop-types'
import React from 'react'
import RelationCard from 'common/relationship/RelationCard'
import ScreeningCreateRelationshipContainer from 'containers/screenings/ScreeningCreateRelationshipContainer'
import {CandidatesPropType} from 'data/candidates'
import {CardBody} from '@cwds/reactstrap'

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
  <CardBody>
    {isScreening &&
      people.map((person, index) => (
        <div key={index}>
          <div className="row" key={`new-${index}`}>
            <div className="col-md-12">
              {person.relationships.length > 0 && (
                <span>
                  <RelationCard
                    editFormRelationship={editFormRelationship}
                    errors={errors}
                    isInvalidForm={isInvalidForm}
                    isSaving={isSaving}
                    isScreening={isScreening}
                    onChange={onChange}
                    onClick={onClick}
                    onEdit={onEdit}
                    onSave={onSave}
                    person={person}
                    screeningId={screeningId}
                    pendingPeople={pendingPeople}
                  />
                </span>
              )}
              {person.relationships.length === 0 && (
                <div className="no-relationships well">
                  <strong>{person.name}</strong> has no known relationships
                </div>
              )}
            </div>
          </div>
          <ScreeningCreateRelationshipContainer
            personId={person.id}
            relationshipsButtonStatus={relationshipsButtonStatus}
          />
        </div>
      ))}
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
  </CardBody>
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
  <CardBody>
    <div className="row">
      <div className="col-md-12 empty-relationships">
        <div className="double-gap-top  centered">
          <span className="c-dark-grey">
            Search for people and add them to see their relationships.
          </span>
        </div>
      </div>
    </div>
  </CardBody>
)
