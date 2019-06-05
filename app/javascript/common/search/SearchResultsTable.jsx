import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {dateFormatter} from 'utils/dateFormatter'
import {capitalizedStr} from 'utils/textFormatter'
import {Link} from 'react-router'
import ReactTooltip from 'react-tooltip'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'

class SearchResultsTable extends Component {
  constructor() {
    super()
    this.state = {
      previousPage: -1,
    }
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  columns = [
    {
      Header: '',
      id: 'row',
      maxWidth: 50,
      filterable: false,
      className: 'search-results',
      Cell: (row) => {
        return `${(row.page * row.pageSize) + row.index + 1}.`
      },
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'fullName',
      Cell: (row) => {
        const person = row.original
        const id = person.legacyDescriptor && person.legacyDescriptor.legacy_id
        return (
          <div>
            {<Link to={`/snapshot/detail/${id}`}>{person.fullName}</Link>}
            {person.isSensitive && <span data-tip="Sensitive">&nbsp;<i className="fa fa-circle search-information-flag" aria-hidden="true"/></span>}
            {person.isSealed && <span data-tip="Sealed">&nbsp;<i className="fa fa-circle search-information-flag" aria-hidden="true"/></span>}
            <ReactTooltip className="custom-tool-tip" />
          </div>
        )
      },
    },
    {
      Header: 'Date of Birth',
      accessor: 'dateOfBirth',
      Cell: (row) => dateFormatter(row.original.dateOfBirth),
    },
    {
      Header: 'Sex at Birth',
      accessor: 'gender',
      Cell: (row) => capitalizedStr(row.original.gender),
    },
    {
      Header: 'Service Provider County',
      accessor: 'spCounty',
    },
    {
      Header: 'Service Provider Phone',
      accessor: 'spPhone',
      Cell: (row) => phoneNumberFormatter(row.original.spPhone),
    },
    {
      id: 'address',
      Header: 'Address',
      accessor: (result) => {
        const address = result.address
        return address ?
          `${address.streetAddress}, ${address.city}, ${address.state} ${address.zip}` :
          ''
      },
    },
    {
      Header: 'Case Status',
      accessor: 'caseStatus',
    },
  ]

  fetchData(pageIndex) {
    const previousPage = this.state.previousPage
    const currentPage = pageIndex + 1
    this.props.setCurrentPageNumber(currentPage)
    if (currentPage > previousPage) {
      this.props.onLoadMoreResults(this.props.personSearchFields)
    }
    this.setState({previousPage: pageIndex})
  }

  setRowAndFetchData(pageSize, pageIndex) {
    const currentPage = pageIndex + 1
    this.props.setCurrentRowNumber(pageSize)
    this.props.setCurrentPageNumber(currentPage)
    this.props.onLoadMoreResults(this.props.personSearchFields)
  }

  render() {
    const {resultsSubset, total, currentRow} = this.props
    return (
      <ReactTable
        columns={this.columns}
        manual
        data={resultsSubset}
        minRows={0}
        pages={Math.ceil(total / currentRow)}
        onPageChange={(pageIndex) => this.fetchData(pageIndex)}
        defaultPageSize={currentRow}
        onPageSizeChange={(pageSize, pageIndex) => this.setRowAndFetchData(pageSize, pageIndex)}
      />
    )
  }
}

SearchResultsTable.propTypes = {
  currentRow: PropTypes.number,
  onLoadMoreResults: PropTypes.func,
  personSearchFields: PropTypes.object,
  results: PropTypes.array,
  resultsSubset: PropTypes.array,
  setCurrentPageNumber: PropTypes.func,
  setCurrentRowNumber: PropTypes.func,
  total: PropTypes.number,
}

export default SearchResultsTable
