import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {checkStaffPermission} from 'actions/staffActions'
import {bindActionCreators} from 'redux'
import userNameFormatter from 'utils/userNameFormatter'
import {config, isSnapshot, isHotline} from 'common/config'
import {ScrollToTop} from 'common/app/ScrollToTop'
import {createScreening} from 'actions/screeningActions'
import {snapshotEnabledSelector, hotlineEnabledSelector} from 'selectors/homePageSelectors'
import {Page, CaresProvider, MenuItem, UncontrolledUserMenu} from '@cwds/components'
import BreadCrumb from 'containers/common/BreadCrumb'
import {createSnapshot} from 'actions/snapshotActions'
import {clearPeople} from 'actions/personCardActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {clearRelationships} from 'actions/relationshipsActions'
import {
  clear as clearSearch,
  resetPersonSearch,
} from 'actions/peopleSearchActions'
import {getScreeningTitleSelector, getScreeningIsReadOnlySelector} from 'selectors/screeningSelectors'
import {
  getAllCardsAreSavedValueSelector,
  getScreeningHasErrorsSelector,
  getPeopleHaveErrorsSelector,
} from 'selectors/screening/screeningPageSelectors'
import {Link} from 'react-router'

const RouterScrollToTop = withRouter(ScrollToTop)

const Footer = () => (
  <div aria-label= 'footer' className= 'col-12-xs text-center footer'><br/>
    <span><Link to='/pages/privacy_policy'>Privacy Policy</Link></span>
    <span> <Link to='/pages/conditions_of_use'>Conditions of use</Link></span>
  </div>
)
export class App extends React.Component {
  componentDidMount() {
    const {fetchSystemCodesAction, checkStaffPermission, fetchUserInfoAction} = this.props.actions
    fetchUserInfoAction()
    fetchSystemCodesAction()
    checkStaffPermission('add_sensitive_people')
    checkStaffPermission('has_state_override')
  }

  dashBoardButtons() {
    return <div className='pull-right'>
      {
        this.props.snapshot &&
    <button type='button'
      className='btn primary-btn'
      disabled={false}
      onClick={this.props.actions.createSnapshot}
    >
    Start Snapshot
    </button>
      }
      {
        this.props.hotline &&
    <button type='button'
      className='btn primary-btn'
      disabled={false}
      onClick={this.props.actions.createScreening}
    >
    Start Screening
    </button>
      }
    </div>
  }

  SnapshotButton() {
    return (
      <button
        type="button"
        className="btn primary-btn pull-right"
        disabled={false}
        onClick={this.props.startOver}
        primary
        size='lg'
      >
    Start Over
      </button>
    )
  }

  ScreeningButton() {
    const {editable, disableSubmitButton, params: {id}, actions: {submitScreening}} = this.props
    if (editable) {
      return (
        <button type='button'
          className='btn primary-btn pull-right'
          disabled={disableSubmitButton}
          onClick={() => submitScreening(id)}
        >
          Submit
        </button>
      )
    } else {
      return (<div />)
    }
  }

  render() {
    const breadcrumb = <BreadCrumb isHotline={isHotline(location)}/>
    const logoutUrl = `${config().base_path.replace(/\/$/, '')}/logout`

    const UserMenu = (state) => {
      const name = this.props.fullName
      return (
        <UncontrolledUserMenu label={name}>
          <MenuItem className={'no-uppercase'} tag={'a'} href={logoutUrl}>
            Logout
          </MenuItem>
        </UncontrolledUserMenu>
      )
    }

    // eslint-disable-next-line no-nested-ternary
    const buttons = isSnapshot(location) ? this.SnapshotButton() : isHotline(location) ? this.ScreeningButton() : this.dashBoardButtons()

    // eslint-disable-next-line no-nested-ternary
    const pageTitle = isSnapshot(location) ? 'Snapshort' :
      isHotline(location) ? 'Hotline' :
        'Dashboard'
    return (
      <RouterScrollToTop>
        <CaresProvider UserMenu={UserMenu} Brand= 'CWS-CARES'>
          <Page Breadcrumb={breadcrumb} layout= 'dashboard' title= {pageTitle} PageActions={() => buttons}>
            {this.props.children}
            <Footer />
          </Page>
        </CaresProvider>
      </RouterScrollToTop>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  createScreening: PropTypes.func,
  createSnapshot: PropTypes.func,
  disableSubmitButton: PropTypes.bool,
  editable: PropTypes.bool,
  fullName: PropTypes.string,
  hotline: PropTypes.bool,
  params: PropTypes.object.isRequired,
  snapshot: PropTypes.bool,
  startOver: PropTypes.func,
}
const mapStateToProps = (state, _ownProps) => ({
  fullName: userNameFormatter(getUserNameSelector(state)),
  snapshot: snapshotEnabledSelector(state),
  hotline: hotlineEnabledSelector(state),
  screeningTitle: getScreeningTitleSelector(state),
  editable: !getScreeningIsReadOnlySelector(state),
  disableSubmitButton: !getAllCardsAreSavedValueSelector(state) ||
        getScreeningHasErrorsSelector(state) ||
        getPeopleHaveErrorsSelector(state),
})

function mapDispatchToProps(dispatch, _ownProps) {
  const actions = {fetchUserInfoAction, fetchSystemCodesAction, checkStaffPermission, createScreening, createSnapshot}
  return {
    actions: bindActionCreators(actions, dispatch),
    startOver: () => {
      dispatch(createSnapshot())
      dispatch(clearPeople())
      dispatch(clearHistoryOfInvolvement())
      dispatch(clearRelationships())
      dispatch(clearSearch('results'))
      dispatch(resetPersonSearch())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
