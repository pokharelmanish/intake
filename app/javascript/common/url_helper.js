export const urlHelper = path => {
  const railsRelativeUrlPath = process.env.RAILS_RELATIVE_URL_ROOT ? process.env.RAILS_RELATIVE_URL_ROOT : ''
  return railsRelativeUrlPath + path
}
