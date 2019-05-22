import {connect} from 'react-redux'
import {BreadCrumb} from 'common/BreadCrumb'
import {getHasGenericErrorValueSelector} from 'selectors/errorsSelectors'

export const mapStateToProps = (state) => ({
  hasError: getHasGenericErrorValueSelector(state),
})

export default connect(mapStateToProps)(BreadCrumb)
