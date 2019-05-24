import React from 'react'
import PropTypes from 'prop-types'
import CaseView from 'views/history/CaseView'
import ReferralView from 'views/history/ReferralView'
import ScreeningView from 'views/history/ScreeningView'
import CopyableCaseView from 'views/history/copyable/CaseView'
import CopyableReferralView from 'views/history/copyable/ReferralView'
import CopyableScreeningView from 'views/history/copyable/ScreeningView'
import Clipboard from 'react-clipboard.js'

const offset = 1
const toOneBasedNumbering = (i) => i + offset

export default class HistoryTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {copyFriendly: false}
  }

  componentDidUpdate() {
    const {copyFriendly} = this.state
    const {friendlyCopy} = this.props
    if (copyFriendly) {
      friendlyCopy(() => this.setState({copyFriendly: false}))
    }
  }

  renderColGroup() {
    return (
      <colgroup key='colgroup'>
        <col/>
        <col className='col-md-2'/>
        <col className='col-md-2'/>
        <col className='col-md-1'/>
        <col className='col-md-7'/>
      </colgroup>
    )
  }

  renderTHead() {
    return (
      <thead key='thead'>
        <tr>
          <td />
          <th scope='col'>Date</th>
          <th scope='col'>Type/Status</th>
          <th scope='col'>County/Office</th>
          <th scope='col'>People and Roles</th>
        </tr>
      </thead>
    )
  }

  renderButtonRow() {
    return (
      <div className='row'>
        <div className='centered copy-button' id='copy-button'>
          <Clipboard
            className='btn btn-primary'
            data-clipboard-target='#history'
          >
            Copy History
          </Clipboard>
        </div>
      </div>
    )
  }

  renderTableContents(Screening, Referral, Case) {
    const {cases, referrals, screenings} = this.props
    return [
      this.renderColGroup(),
      this.renderTHead(),
      (<tbody key='tbody'>
        {screenings.map((screening, index) => <Screening {...screening} index={toOneBasedNumbering(index)} key={index} />)}
        {referrals.map((referral, index) => <Referral {...referral} index={toOneBasedNumbering(index)} key={index} />)}
        {cases.map((hoiCase, index) => <Case {...hoiCase} index={toOneBasedNumbering(index)} key={index} />)}
      </tbody>),
    ]
  }

  renderTable() {
    const {onCopy} = this.props
    return (
      <div className='table-responsive' id='history'
        onCopy={(e) => (
          onCopy(e, this.copyableTable, () => {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            this.setState({copyFriendly: true})
          }))}
        onError={() => this.setState({copyFriendly: false})}
      >
        <table className='table history-table ordered-table' >
          {this.renderTableContents(ScreeningView, ReferralView, CaseView)}
        </table>
      </div>)
  }

  renderCopyFriendlyTable() {
    const {copyFriendly} = this.state
    const display = copyFriendly ? 'block' : 'none'
    return (
      <div className= 'copy-friendly' id='history-copy-friendly' style={{display}}
        ref={(history) => { this.copyableTable = history }}
        onError={() => this.setState({copyFriendly: false})}
      >
        <table className='copy-friendly' style={{display: 'block', border: '1px solid black'}}>
          {this.renderTableContents(CopyableScreeningView, CopyableReferralView, CopyableCaseView)}
        </table>
      </div>)
  }

  render() {
    return (<div className='card-body no-pad-top'>
      {this.renderTable()}
      {this.renderCopyFriendlyTable()}
      {this.renderButtonRow()}
    </div>
    )
  }
}

HistoryTable.propTypes = {
  cases: PropTypes.array,
  friendlyCopy: PropTypes.func,
  onCopy: PropTypes.func,
  referrals: PropTypes.array,
  screenings: PropTypes.array,
}
