import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {createSnapshot, clearSnapshot} from 'actions/snapshotActions'
import {clearPeople, createSnapshotPerson} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {clearRelationships} from 'actions/relationshipsActions'
import PersonSearchFormContainer from 'containers/common/PersonSearchFormContainer'
import PersonCardView from 'snapshots/PersonCardView'
import HistoryOfInvolvementContainer from 'containers/snapshot/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/common/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import RelationshipsCardContainer from 'containers/snapshot/RelationshipsCardContainer'
import {selectParticipants} from 'selectors/participantSelectors'
import {getHasGenericErrorValueSelector} from 'selectors/errorsSelectors'
import PersonSearchResultsContainer from 'containers/snapshot/PersonSearchResultsContainer'
import {selectPeopleResults} from 'selectors/peopleSearchSelectors'
import {isAdvancedSearchOn} from 'common/config'

const isDuplicatePerson = (participants, id) =>
  participants.some(x => x.id === id)

export class SnapshotPage extends React.Component {
  componentDidMount() {
    this.props.createSnapshot()
  }

  componentWillUnmount() {
    this.props.unmount()
  }
  onSelectPerson(person) {
    const id = person.legacyDescriptor && person.legacyDescriptor.legacy_id
    if (!isDuplicatePerson(this.props.participants, id)) {
      this.props.createSnapshotPerson(id)
    }
  }

  renderBody(participants) {
    const {results, location} = this.props
    const advancedSearchFeatureFlag = isAdvancedSearchOn(location)
    const hasResults = results && results.length !== 0
    return (
      <div className="col-md-12 col-xs-12 snapshot-inner-container">
        <div className="row">
          <PersonSearchFormContainer
            onSelect={person => this.onSelectPerson(person)}
            searchPrompt="Search for clients"
            canCreateNewPerson={false}
            isClientOnly={true}
          />
          {participants.map(({id}) => (
            <PersonCardView key={id} personId={id} />
          ))}
          {advancedSearchFeatureFlag && hasResults && <PersonSearchResultsContainer />}
          <RelationshipsCardContainer />
          <HistoryOfInvolvementContainer
            empty={<EmptyHistory />}
            notEmpty={<HistoryTableContainer includesScreenings={false} />}
          />
        </div>
      </div>
    )
  }

  render() {
    const {participants, hasGenericErrors} = this.props
    const genericErrorClass = hasGenericErrors ? 'generic-error' : ''
    return (
      <div>
        <div className={`container snapshot-container ${genericErrorClass}`}>
          <div className="row">
            {this.renderBody(participants)}
          </div>
        </div>
      </div>
    )
  }
}

SnapshotPage.propTypes = {
  createSnapshot: PropTypes.func,
  createSnapshotPerson: PropTypes.func,
  hasGenericErrors: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  participants: PropTypes.array,
  results: PropTypes.array,
  startOver: PropTypes.func,
  unmount: PropTypes.func,
}

const mapStateToProps = state => ({
  hasGenericErrors: getHasGenericErrorValueSelector(state),
  participants: selectParticipants(state).toJS(),
  results: selectPeopleResults(state).toJS(),
})

export const mapDispatchToProps = dispatch => ({
  createSnapshot: () => dispatch(createSnapshot()),
  createSnapshotPerson: id => dispatch(createSnapshotPerson(id)),
  unmount: () => {
    dispatch(clearPeople())
    dispatch(clearHistoryOfInvolvement())
    dispatch(clearRelationships())
    dispatch(clearSnapshot())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapshotPage)
