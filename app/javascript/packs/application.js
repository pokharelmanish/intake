/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
import '@babel/polyfill'
import 'jquery'
import 'common/jquery-helpers'

import 'bootstrap'
import ReactDOM from 'react-dom'
import Routes from 'common/app/Routes'
import '@cwds/components/scss/global.scss'

// CSS
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'bootstrap/dist/css/bootstrap'
import '../../assets/stylesheets/helpers'
import '../../assets/stylesheets/accessibility'
import '../../assets/stylesheets/form'
import '../../assets/stylesheets/list'
import '../../assets/stylesheets/table'
import '../../assets/stylesheets/navigation'
import '../../assets/stylesheets/typography'
import 'react-select/dist/react-select.css'
import 'react-widgets/dist/css/react-widgets.css'
import '../../assets/stylesheets/multi-select'
import '../../assets/stylesheets/ie'
import '../../assets/stylesheets/google-api'
import '../../assets/stylesheets/page-error'
import '../../assets/stylesheets/search'
import '../../assets/stylesheets/shame_overrides'
import '../../assets/stylesheets/screening_relationship.scss'

if (document.getElementById('app')) {
  ReactDOM.render(Routes(), document.getElementById('app'))
}
