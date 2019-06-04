import {createSelector} from 'reselect'
import {userPrivilegesSelector} from 'selectors/userInfoSelectors'
import {isFeatureActive} from 'common/config'

export const snapshotEnabledSelector = createSelector(
  userPrivilegesSelector,
  (privileges) => privileges.includes('Snapshot-rollout') && isFeatureActive('snapshot')
)
