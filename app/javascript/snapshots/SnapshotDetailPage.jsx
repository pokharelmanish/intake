import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {clearSnapshot, viewSnapshotSearch} from 'actions/snapshotActions'
import {clearPeople, createSnapshotPerson} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {clearRelationships} from 'actions/relationshipsActions'
import PersonCardView from 'snapshots/PersonCardView'
import HistoryOfInvolvementContainer from 'containers/snapshot/HistoryOfInvolvementContainer'
import HistoryTableContainer from 'containers/common/HistoryTableContainer'
import EmptyHistory from 'views/history/EmptyHistory'
import RelationshipsCardContainer from 'containers/snapshot/RelationshipsCardContainer'
// import PageHeader from 'common/PageHeader'
import {selectParticipants} from 'selectors/participantSelectors'
// import BreadCrumb from 'containers/common/BreadCrumb'
import {getHasGenericErrorValueSelector} from 'selectors/errorsSelectors'
import {selectPeopleResults} from 'selectors/peopleSearchSelectors'
// import {urlHelper} from 'common/url_helper.js.erb'
// import {Link} from 'react-router'

export class SnapshotDetailPage extends React.Component {
  componentDidMount() {
    const {id} = this.props.params
    this.props.clearSnapshot()
    this.props.createSnapshotPerson(id)
  }

  componentWillUnmount() {
    this.props.unmount()
  }

  // backToResultsButton() {
  //   const {goBackToResults} = this.props
  //   return (
  //     <button
  //       type="button"
  //       className="btn primary-btn pull-right"
  //       disabled={false}
  //       onClick={goBackToResults}
  //     >
  //       Back to Results
  //     </button>
  //   )
  // }

  renderBody(participants) {
    return (
      <div className="col-md-12 col-xs-12 snapshot-inner-container">
        <div className="row">
          {participants.map(({id}) => (
            <PersonCardView key={id} personId={id} />
          ))}
          <RelationshipsCardContainer />
          <HistoryOfInvolvementContainer
            empty={<EmptyHistory />}
            notEmpty={<HistoryTableContainer includesScreenings={false} />}
          />
        </div>
      </div>
    )
  }

  // renderBreadCrumbs() {
  //   const {id} = this.props.params
  //   const snapShotCrumb = (<Link key={id} to={urlHelper('/snapshot')}>Snapshot</Link>)
  //   const detailCrumb = 'Detail'
  //   const crumbs = [snapShotCrumb, detailCrumb]
  //   return <BreadCrumb navigationElements={crumbs}/>
  // }

  render() {
    const {participants, hasGenericErrors} = this.props
    const genericErrorClass = hasGenericErrors ? 'generic-error' : ''
    return (
      <Fragment>
        {/* <div>
          <PageHeader pageTitle="Snapshot" button={this.backToResultsButton()} />
          {this.renderBreadCrumbs()}
        </div> */}
        <div className={`container snapshot-container ${genericErrorClass}`}>
          <div className="row">
            {this.renderBody(participants)}
          </div>
        </div>
      </Fragment>
    )
  }
}

SnapshotDetailPage.propTypes = {
  clearSnapshot: PropTypes.func,
  createSnapshotPerson: PropTypes.func,
  goBackToResults: PropTypes.func,
  hasGenericErrors: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
  participants: PropTypes.array,
  unmount: PropTypes.func,
}

const mapStateToProps = state => ({
  hasGenericErrors: getHasGenericErrorValueSelector(state),
  participants: selectParticipants(state).toJS(),
  results: selectPeopleResults(state).toJS(),
})

export const mapDispatchToProps = dispatch => ({
  clearSnapshot: () => dispatch(clearSnapshot()),
  createSnapshotPerson: id => dispatch(createSnapshotPerson(id)),
  goBackToResults: () => dispatch(viewSnapshotSearch()),
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
)(SnapshotDetailPage)
