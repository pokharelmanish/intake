import {snapshotEnabledSelector} from 'selectors/homePageSelectors'
import {List, fromJS} from 'immutable'
import * as IntakeConfig from 'common/config'

describe('snapshotEnabledSelector', () => {
  describe('when snapshot feature is active', () => {
    it('returns true if the snapshot privilege is present', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(true)
      const state = fromJS({
        userInfo: {
          privileges: ['Snapshot-rollout'],
        },
      })
      expect(snapshotEnabledSelector(state)).toBe(true)
    })
    it('returns false if the snapshot privilege is not present', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(true)
      const state = fromJS({
        userInfo: {
          privileges: [],
        },
      })
      expect(snapshotEnabledSelector(state)).toBe(false)
    })
  })
  describe('when snapshot feature is not active', () => {
    it('returns false if the snapshot privilege is present', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
      const state = fromJS({
        userInfo: {
          privileges: ['Snapshot-rollout'],
        },
      })
      expect(snapshotEnabledSelector(state)).toBe(false)
    })
    it('returns false if the snapshot privilege is not present', () => {
      spyOn(IntakeConfig, 'isFeatureActive').and.returnValue(false)
      const state = fromJS({
        userInfo: {
          privileges: [],
        },
      })
      expect(snapshotEnabledSelector(state)).toBe(false)
    })
  })
})
