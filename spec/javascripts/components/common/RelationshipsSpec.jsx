import React from 'react'
import {shallow} from 'enzyme'
import {EmptyRelationships, Relationships} from 'common/Relationships'

describe('Relationships for Snapshot', () => {
  const onClick = jasmine.createSpy('onClick')
  const renderRelationships = props =>
    shallow(
      <Relationships {...props} isScreening={false} onClick={onClick} />,
      {disableLifecycleMethods: true}
    )

  it('renders people with no relationships', () => {
    const people = [
      {name: 'Sally Jones', relationships: []},
      {name: 'Nate Starbringer', relationships: []},
      {name: 'Jim Johnson', relationships: []},
    ]
    const component = renderRelationships({people})

    expect(
      component
        .find('.person')
        .at(0)
        .text()
    ).toEqual('Sally Jones')
    expect(
      component
        .find('.person')
        .at(1)
        .text()
    ).toEqual('Nate Starbringer')
    expect(
      component
        .find('.person')
        .at(2)
        .text()
    ).toEqual('Jim Johnson')
  })

  it('renders relationships for each person', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {
            name: 'Jim Johnson',
            type: 'father',
            person_card_exists: false,
            legacy_descriptor: {legacy_id: '2'},
          },
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {
            name: 'Nate Starbringer',
            type: 'son',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '4'},
          },
          {
            name: 'Sally Jones',
            type: 'daughter',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '3'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    const relationships = component.find('li.person-relationship')
    expect(relationships.length).toBe(4)
    expect(relationships.at(0).find('.relationship-type').text()).toEqual('mother')
    expect(relationships.at(0).find('.relationship-name').text()).toEqual('Jane Johnson')
    expect(relationships.at(1).find('.relationship-type').text()).toEqual('father')
    expect(relationships.at(1).find('.relationship-name').text()).toEqual('Jim Johnson')
    expect(relationships.at(2).find('.relationship-type').text()).toEqual('son')
    expect(relationships.at(2).find('.relationship-name').text()).toEqual('Nate Starbringer')
    expect(relationships.at(3).find('.relationship-type').text()).toEqual('daughter')
    expect(relationships.at(3).find('.relationship-name').text()).toEqual('Sally Jones')
  })

  it('renders relationships with sealed information flag when isSealed is true', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSealed: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    }).find('.information-flag')
    expect(component.at(0).html()).toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })

  it('does not renders relationships with sealed information flag when isSealed is false', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSealed: false,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    const relationships = component.find('li.person-relationship')
    expect(relationships.at(0).find('.relationship-type').text()).toEqual('mother')
    expect(relationships.at(0).find('.relationship-name').text()).toEqual('Jane Johnson')
    expect(component.at(0).html()).not.toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })

  it('renders relationships with sensitive information flag when isSensitive is true', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSensitive: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    const relationships = component.find('li.person-relationship')
    expect(relationships.at(0).find('.relationship-type').text()).toEqual('mother')
    expect(relationships.at(0).find('.relationship-name').text()).toEqual('Jane Johnson')
    expect(component.at(0).html()).toContain(
      '<span class="information-flag search-result">Sensitive</span>'
    )
  })

  it('does not renders relationships with sensitive information flag when isSensitive is false', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSensitive: false,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    const relationships = component.find('li.person-relationship')
    expect(relationships.at(0).find('.relationship-type').text()).toEqual('mother')
    expect(relationships.at(0).find('.relationship-name').text()).toEqual('Jane Johnson')
    expect(component.at(0).html()).not.toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })
})

describe('EmptyRelationships', () => {
  it('renders a reminder to add people when there are no relationships', () => {
    const component = shallow(<EmptyRelationships />, {
      disableLifecycleMethods: true,
    })
    expect(component.find('.empty-relationships').text()).toEqual(
      'Search for people and add them to see their relationships.'
    )
  })
})
