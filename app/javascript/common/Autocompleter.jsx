import PersonSuggestion from 'common/PersonSuggestion'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Autocomplete from 'react-autocomplete'
import SuggestionHeader from 'common/SuggestionHeader'
import AutocompleterFooter from 'common/AutocompleterFooter'

const menuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #d4d4d4',
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
  fontFamily: 'Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: 300,
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  display: 'block',
}
const resultStyle = {
  borderBottom: '2px solid #d4d4d4',
  cursor: 'pointer',
  padding: '10px 20px',
}
const resultStyleHighlighted = {
  ...resultStyle,
  backgroundColor: '#d4d4d4',
}
const MIN_SEARCHABLE_CHARS = 2

export class Autocompleter extends Component {
  onItemSelect = (_value, item) => {
    const {isSelectable, onClear, onChange, onSelect} = this.props
    if (isSelectable(item)) {
      onClear()
      onChange('')
      onSelect(item)
    }
  }

  renderMenu = (items, searchTerm, _style) => {
    const {canCreateNewPerson, onLoadMoreResults, onSelect, total} = this.props
    return (
      <div style={menuStyle}>
        <SuggestionHeader
          currentNumberOfResults={items.length}
          total={total}
          searchTerm={searchTerm}
        />
        {items}
        <AutocompleterFooter
          canCreateNewPerson={canCreateNewPerson}
          canLoadMoreResults={items && total !== items.length}
          onLoadMoreResults={onLoadMoreResults}
          onCreateNewPerson={() => {
            onSelect({id: null})
          }}
        />
      </div>
    )
  }

  renderItem = (item, isHighlighted, _styles) => {
    const key = item.legacyDescriptor.legacy_id
    return (
      <div
        id={`search-result-${key}`}
        key={key}
        style={isHighlighted ? resultStyleHighlighted : resultStyle}
      >
        <PersonSuggestion
          address={item.address}
          dateOfBirth={item.dateOfBirth}
          ethnicity={item.ethnicity}
          firstName={item.firstName}
          gender={item.gender}
          isSealed={item.isSealed}
          isSensitive={item.isSensitive}
          languages={item.languages}
          lastName={item.lastName}
          legacyDescriptor={item.legacyDescriptor}
          middleName={item.middleName}
          nameSuffix={item.nameSuffix}
          phoneNumber={item.phoneNumber}
          races={item.races}
          ssn={item.ssn}
        />
      </div>
    )
  }
  onChangeInput = (_, value) => {
    const {onSearch, onChange} = this.props
    const isSearchable = value && value.replace(/^\s+/, '').length >= MIN_SEARCHABLE_CHARS
    if (isSearchable) {
      onSearch(value)
    }
    onChange(value)
  }
  render() {
    const {searchTerm, id, results} = this.props
    return (
      <Autocomplete
        getItemValue={(_) => searchTerm}
        inputProps={{id}}
        items={results}
        onChange={this.onChangeInput}
        onSelect={this.onItemSelect}
        renderItem={this.renderItem}
        renderMenu={this.renderMenu}
        value={searchTerm}
        wrapperStyle={{display: 'block', position: 'relative'}}
      />
    )
  }
}

Autocompleter.propTypes = {
  canCreateNewPerson: PropTypes.bool,
  id: PropTypes.string,
  isSelectable: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onLoadMoreResults: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  total: PropTypes.number,
}

Autocompleter.defaultProps = {
  isSelectable: () => true,
}

Autocompleter.displayName = 'Autocompleter'

export default Autocompleter
