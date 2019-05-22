import React from 'react'
import PropTypes from 'prop-types'
import {Breadcrumb, BreadcrumbItem} from '@cwds/components'
import {Link} from 'react-router'
import {urlHelper} from 'common/url_helper.js.erb'

export const BreadCrumb = ({
  hasError,
  isHotline,
  id,
}) => {
  const klasses = hasError ? 'container back-to-dashboard-error' : 'container back-to-dashboard'
  return (
    <div className={klasses}>
      <span style={{display: 'flex'}}> Back to:  <Breadcrumb>
        <BreadcrumbItem>
          <a href="/dashboard">Dashboard</a>
        </BreadcrumbItem>
        { isHotline ? <BreadcrumbItem>
          <Link key={id} to={urlHelper('/')}>CaseLoad</Link>
        </BreadcrumbItem> : null }
      </Breadcrumb>
      </span>
    </div>
  )
}

BreadCrumb.propTypes = {
  hasError: PropTypes.bool,
  id: PropTypes.string,
  isHotline: PropTypes.bool,
}
