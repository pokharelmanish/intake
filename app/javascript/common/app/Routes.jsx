import PropTypes from 'prop-types'
import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import App from 'common/app/App'
import {default as HomePageContainer} from 'containers/HomePageContainer'
import SnapshotPage from 'snapshots/SnapshotPage'
import SnapshotDetailPage from 'snapshots/SnapshotDetailPage'
import ConditionsOfUse from 'views/pages/ConditionsOfUse'
import PrivacyPolicy from 'views/pages/PrivacyPolicy'
import NotFoundPage from 'errors/NotFoundPage'
import ForbiddenPage from 'errors/ForbiddenPage'
import ServerErrorPage from 'errors/ServerErrorPage'
import {store} from 'store/configureStore'
import {Provider} from 'react-redux'
import {routerHistory} from 'common/history'
import {createSelectLocationState} from 'reducers/routerReducer'
import {syncHistoryWithStore} from 'react-router-redux'
import * as IntakeConfig from 'common/config'

const history = syncHistoryWithStore(routerHistory, store, {selectLocationState: createSelectLocationState()})

const snapshotActive = IntakeConfig.isFeatureActive('snapshot')
const screeningActive = IntakeConfig.isFeatureActive('screenings')

export const Routes = ({
  store,
  history,
  snapshotActive,
  screeningActive,
}) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={HomePageContainer} />
        {snapshotActive && <Route path='snapshot' component={SnapshotPage}/>}
        {snapshotActive && <Route path='snapshot/detail/:id' component={SnapshotDetailPage}/>}
        <Route path='logout' component={() => (window.location = IntakeConfig.config().authentication_logout_url)}/>
        <Route path='pages/conditions_of_use' component={ConditionsOfUse}/>
        <Route path='pages/privacy_policy' component={PrivacyPolicy}/>
        <Route path='server_error' component={ServerErrorPage}/>
        <Route path='forbidden' component={ForbiddenPage}/>
        <Route path='*' component={NotFoundPage}/>
      </Route>
    </Router>
  </Provider>
)

Routes.propTypes = {
  history: PropTypes.object.isRequired,
  screeningActive: PropTypes.bool.isRequired,
  snapshotActive: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
}

export default () => Routes({store, history, snapshotActive, screeningActive})
