import {takeEvery, put, call, select} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  loadMorePeopleSearchResultsSaga,
  loadMorePeopleSearch,
} from 'sagas/loadMorePeopleSearchResultsSaga'
import {
  selectLastResultsSortValue,
  selectSearchResultsCurrentRow,
} from 'selectors/peopleSearchSelectors'
import {
  LOAD_MORE_RESULTS,
  loadMoreResults,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'

describe('loadMorePeopleSearchResultsSaga', () => {
  it('loads more people search results on LOAD_MORE_RESULTS', () => {
    const peopleSeachResultsSagaGenerator = loadMorePeopleSearchResultsSaga()
    expect(peopleSeachResultsSagaGenerator.next().value).toEqual(
      takeEvery(LOAD_MORE_RESULTS, loadMorePeopleSearch)
    )
  })
})

describe('loadMorePeopleSearch', () => {
  const isClientOnly = true
  const isAdvancedSearchOn = true
  const personSearchFields = {lastName: 'Doe'}
  const action = loadMoreResults(isClientOnly, isAdvancedSearchOn, personSearchFields)
  const lastResultSort = ['last_result_sort']

  it('finds some error during the process', () => {
    const error = 'Something went wrong'
    const peopleSeachGenerator = loadMorePeopleSearch(action)
    const size = 25
    const searchParams = {
      is_client_only: true,
      is_advanced_search_on: true,
      person_search_fields: {last_name: 'Doe'},
      size: size,
      search_after: lastResultSort,
    }
    expect(peopleSeachGenerator.next(size).value).toEqual(
      select(selectSearchResultsCurrentRow)
    )
    expect(peopleSeachGenerator.next(size).value).toEqual(select(selectLastResultsSortValue))
    expect(peopleSeachGenerator.next(lastResultSort).value).toEqual(call(get, '/api/v1/people', searchParams))
    expect(peopleSeachGenerator.throw(error).value).toEqual(put(loadMoreResultsFailure('Something went wrong')))
  })

  it('loads more people search results successfully', () => {
    const searchResults = {
      hits: {
        hits: [],
      },
    }
    const size = 25
    const peopleSeachGenerator = loadMorePeopleSearch(action)
    expect(peopleSeachGenerator.next(size).value).toEqual(
      select(selectSearchResultsCurrentRow)
    )
    expect(peopleSeachGenerator.next(size).value).toEqual(select(selectLastResultsSortValue))
    expect(peopleSeachGenerator.next(lastResultSort).value).toEqual(call(get, '/api/v1/people', {
      is_client_only: true,
      is_advanced_search_on: true,
      person_search_fields: {last_name: 'Doe'},
      size: size,
      search_after: lastResultSort,
    }))
    expect(peopleSeachGenerator.next(searchResults).value).toEqual(put(loadMoreResultsSuccess(searchResults)))
  })
})
