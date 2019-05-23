import React from 'react'
import {shallow} from 'enzyme'
import ScreeningDecisionShow from 'views/ScreeningDecisionShow'

describe('ScreeningDecisionShow', () => {
  const renderScreeningDecisionShow = ({
    accessRestriction = {},
    additionalInformation = {},
    decision = {},
    decisionDetail = {label: ''},
    restrictionRationale = {},
    ...options
  }) => {
    const props = {
      accessRestriction,
      additionalInformation,
      decision,
      decisionDetail,
      restrictionRationale,
      ...options,
    }
    return shallow(<ScreeningDecisionShow {...props}/>, {disableLifecycleMethods: true})
  }

  it('does not render an Edit Link if no onEdit is passed', () => {
    const component = renderScreeningDecisionShow({})
    const editLink = component.find('EditLink')
    expect(editLink.exists()).toEqual(false)
  })

  it('renders the decision header and value', () => {
    const component = renderScreeningDecisionShow({
      decision: {
        value: 'Promote to referral',
        errors: ['This is not ok!'],
      },
    })
    const decision = component.find('ShowField[label="Screening Decision"]')
    expect(decision.exists()).toEqual(true)
    expect(decision.props().label).toEqual('Screening Decision')
    expect(decision.props().required).toEqual(true)
    expect(decision.props().errors).toEqual(['This is not ok!'])
    expect(decision.children().text()).toEqual('Promote to referral')
  })

  it('displays an errorMessage alert if one is passed', () => {
    const component = renderScreeningDecisionShow({alertErrorMessage: 'Nope'})
    expect(component.find('AlertErrorMessage').exists()).toEqual(true)
    expect(component.find('AlertErrorMessage').props().message).toEqual('Nope')
  })

  it('does not display an errorMessage alert if one is not passed', () => {
    const component = renderScreeningDecisionShow({})
    expect(component.find('AlertErrorMessage').exists()).toEqual(false)
  })

  it('renders the decision detail header, label, and value', () => {
    const component = renderScreeningDecisionShow({
      decisionDetail: {
        value: '3 days',
        errors: ['This is not ok!'],
        label: 'Response Time',
        required: true,
      },
    })
    const decisionDetail = component.find('ShowField[label="Response Time"]')
    expect(decisionDetail.exists()).toEqual(true)
    expect(decisionDetail.props().label).toEqual('Response Time')
    expect(decisionDetail.props().required).toEqual(true)
    expect(decisionDetail.props().errors).toEqual(['This is not ok!'])
    expect(decisionDetail.children().text()).toEqual('3 days')
  })

  it('does not require decision detail if required is false', () => {
    const component = renderScreeningDecisionShow({
      decisionDetail: {
        label: 'Response Time',
        required: false,
      },
    })
    const decisionDetail = component.find('ShowField[label="Response Time"]')
    expect(decisionDetail.props().required).toEqual(false)
  })

  it('renders a link to the SDM tool', () => {
    const sdmPath = 'http://foo.com'
    const component = renderScreeningDecisionShow({sdmPath})
    expect(component.find('p').text()).toContain('SDM Hotline Tool')
    expect(component.find('div[id="screening_decision"]').text()).toContain('Determine Decision and Response Time by using Structured Decision Making.')
    const sdmLink = component.find('a')
    expect(sdmLink.props().href).toEqual(sdmPath)
    expect(sdmLink.props().target).toEqual('_blank')
    expect(sdmLink.text()).toEqual('Complete SDM')
  })

  it('renders additional information', () => {
    const component = renderScreeningDecisionShow({
      additionalInformation: {value: 'My additional information'},
    })
    const additionalInformation = component.find('ShowField[label="Additional Information"]')
    expect(additionalInformation.exists()).toEqual(true)
    expect(additionalInformation.props().label).toEqual('Additional Information')
    expect(additionalInformation.children().text()).toEqual('My additional information')
  })

  it('renders the additional information label with required', () => {
    const component = renderScreeningDecisionShow({isAdditionalInfoRequired: true})
    const additionalInformationLabel = component.find('ShowField[label="Additional Information"]')
    expect(additionalInformationLabel.props().required).toEqual(true)
  })

  it('renders the additional information label without required', () => {
    const component = renderScreeningDecisionShow({isAdditionalInfoRequired: false})
    const additionalInformationLabel = component.find('ShowField[label="Additional Information"]')
    expect(additionalInformationLabel.props().required).toEqual(false)
  })

  it('renders access restrictions', () => {
    const component = renderScreeningDecisionShow({
      accessRestriction: {value: 'Sealed'},
    })
    const accessRestriction = component.find('ShowField[label="Access Restrictions"]')
    expect(accessRestriction.exists()).toEqual(true)
    expect(accessRestriction.props().label).toEqual('Access Restrictions')
    expect(accessRestriction.children().text()).toEqual('Sealed')
  })

  it('does not render access restrictions if access restrictions is null', () => {
    const component = renderScreeningDecisionShow({
      accessRestriction: {value: null},
    })
    const accessRestriction = component.find('ShowField[label="Access Restrictions"]')
    expect(accessRestriction.exists()).toEqual(false)
  })

  it('does not render restrictions rationale if access restrictions is null', () => {
    const component = renderScreeningDecisionShow({
      accessRestriction: {value: null},
    })
    const restrictionRationale = component.find('ShowField[label="Restrictions Rationale"]')
    expect(restrictionRationale.exists()).toEqual(false)
  })

  it('renders restriction rationale when a value is present', () => {
    const component = renderScreeningDecisionShow({
      restrictionRationale: {value: 'This person needs to be protected'},
    })
    const restrictionRationale = component.find('ShowField[label="Restrictions Rationale"]')
    expect(restrictionRationale.exists()).toEqual(true)
    expect(restrictionRationale.props().label).toEqual('Restrictions Rationale')
    expect(restrictionRationale.children().text()).toEqual('This person needs to be protected')
  })

  it('does not render restriction rationale when no value is present', () => {
    const component = renderScreeningDecisionShow({value: ''})
    const restrictionRationale = component.find('ShowField[label="Restriction Rationale"]')
    expect(restrictionRationale.exists()).toEqual(false)
  })

  it('renders Case or Referral Id field when the decision is "info to cws"', () => {
    const component = renderScreeningDecisionShow({
      decision: {value: 'information_to_child_welfare_services'},
    })
    const screeningContactReferenceId = component.find('ShowField[label="Case or Referral Id"]')
    expect(screeningContactReferenceId.exists()).toEqual(false)
  })

  it('does not render contact reference id as req when decision is not "info to cws"', () => {
    const component = renderScreeningDecisionShow({
      decision: {value: 'promote_to_referral'},
      screeningContactReference: {value: ''},
    })
    const screeningContactReferenceId = component.find('ShowField[label="Case or Referral Id"]')
    expect(screeningContactReferenceId.exists()).toEqual(false)
  })

  it('renders contact reference id when a value is present and decision is "info to cws"', () => {
    const component = renderScreeningDecisionShow({
      screeningContactReference: {value: '111-222'},
      decision: {value: 'Information to child welfare services'},
    })
    const screeningContactReferenceId = component.find('ShowField[label="Case or Referral Id"]')
    expect(screeningContactReferenceId.exists()).toEqual(true)
    expect(screeningContactReferenceId.props().label).toEqual('Case or Referral Id')
    expect(screeningContactReferenceId.children().text()).toEqual('111-222')
  })

  it('does not renders contact reference id when no value is present', () => {
    const component = renderScreeningDecisionShow({value: ''})
    const screeningContactReferenceId = component.find('ShowField[label="Case or Referral Id"]')
    expect(screeningContactReferenceId.exists()).toEqual(false)
  })
})
