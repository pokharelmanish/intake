export const PEOPLE_SEARCH_FETCH = 'PEOPLE_SEARCH/FETCH'
export const PEOPLE_SEARCH_FETCH_COMPLETE = 'PEOPLE_SEARCH/FETCH_COMPLETE'
export const PEOPLE_SEARCH_CLEAR = 'PEOPLE_SEARCH/CLEAR'
export const SET_SEARCH_FIELD = 'PEOPLE_SEARCH/SET_SEARCH_FIELD'
export const SET_SEARCH_FIELD_ERROR_CHECK = 'PEOPLE_SEARCH/SET_SEARCH_FIELD_ERROR_CHECK'
export const LOAD_MORE_RESULTS = 'PEOPLE_SEARCH/LOAD_MORE_RESULTS'
export const LOAD_MORE_RESULTS_COMPLETE = 'PEOPLE_SEARCH/LOAD_MORE_RESULTS_COMPLETE'
export const RESET_PERSON_SEARCH = 'RESET_PERSON_SEARCH'
export const SET_SEARCH_CURRENT_PAGE = 'SET_SEARCH_CURRENT_PAGE'
export const SET_SEARCH_CURRENT_ROW = 'SET_SEARCH_CURRENT_ROW'

export const setPersonSearchField = (field, value) => ({
  type: SET_SEARCH_FIELD,
  payload: {field, value},
})
export const search = (isClientOnly, isAdvancedSearchOn, personSearchFields) => ({
  type: PEOPLE_SEARCH_FETCH,
  payload: {isClientOnly, isAdvancedSearchOn, personSearchFields},
})
export const loadMoreResults = (isClientOnly, isAdvancedSearchOn, personSearchFields) => ({
  type: LOAD_MORE_RESULTS,
  payload: {isClientOnly, isAdvancedSearchOn, personSearchFields},
})
export const loadMoreResultsFailure = (error) => ({
  type: LOAD_MORE_RESULTS_COMPLETE,
  payload: {error},
  error: true,
})
export const loadMoreResultsSuccess = ({hits: {hits}}) => ({
  type: LOAD_MORE_RESULTS_COMPLETE,
  payload: {results: hits},
})
export const fetchSuccess = ({hits: {hits, total}}) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {results: hits, total},
})
export const fetchFailure = (error) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {error},
  error: true,
})
export const clear = (field) => ({
  type: PEOPLE_SEARCH_CLEAR,
  payload: {field},
})
export const resetPersonSearch = () => ({
  type: RESET_PERSON_SEARCH,
})
export const setFieldErrorCheck = (field, value) => ({
  type: SET_SEARCH_FIELD_ERROR_CHECK,
  payload: {field, value},
})
export const setSearchCurrentPage = (pageNumber) => ({
  type: SET_SEARCH_CURRENT_PAGE,
  payload: {pageNumber},
})
export const setSearchCurrentRow = (rowNumber) => ({
  type: SET_SEARCH_CURRENT_ROW,
  payload: {rowNumber},
})
