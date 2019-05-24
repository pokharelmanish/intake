import {
  createSnapshot,
  clearSnapshot,
  viewSnapshotDetail,
} from 'actions/snapshotActions'
import {isFSA} from 'flux-standard-action'

describe('snapshotActions', () => {
  it('createSnapshot is FSA compliant', () => {
    const action = createSnapshot()
    expect(isFSA(action)).toEqual(true)
  })

  it('clearSnapshot is FSA compliant', () => {
    const action = clearSnapshot()
    expect(isFSA(action)).toEqual(true)
  })

  it('viewSnapshotDetail is FSA compliant', () => {
    const action = viewSnapshotDetail('1')
    expect(isFSA(action)).toEqual(true)
  })
})
