import {
  CREATE_SNAPSHOT,
  CLEAR_SNAPSHOT,
  VIEW_SNAPSHOT_DETAIL,
  VIEW_SNAPSHOT_SEARCH,
} from 'actions/actionTypes'

export const SHOW_MODE = 'show'

export function createSnapshot() {
  return {type: CREATE_SNAPSHOT}
}
export function clearSnapshot() {
  return {type: CLEAR_SNAPSHOT}
}
export function viewSnapshotDetail(id) {
  return {type: VIEW_SNAPSHOT_DETAIL, payload: {id}}
}
export function viewSnapshotSearch() {
  return {type: VIEW_SNAPSHOT_SEARCH}
}
