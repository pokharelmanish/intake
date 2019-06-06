import React from 'react'
import {shallow} from 'enzyme'
import RelationshipsCard from 'common/RelationshipsCard'
import {EmptyRelationships} from 'common/Relationships'
import RelationshipsSnapshotContainer from 'containers/snapshot/RelationshipsContainer'

describe('RelationshipsCard', () => {
  const renderRelationshipsCard = (props) => (
    shallow(<RelationshipsCard {...props}/>, {disableLifecycleMethods: true})
  )

  it('renders an empty relationships component when there are no relationships', () => {
    const component = renderRelationshipsCard({areRelationshipsEmpty: true})
    expect(component.find('CardView').props().show).toEqual(<EmptyRelationships />)
  })

  it('renders a relationships container when there are relationships based on screening/snapshot page', () => {
    const component = renderRelationshipsCard({areRelationshipsEmpty: false, isScreening: false})
    expect(component.find('CardView').props().show).toEqual(<RelationshipsSnapshotContainer />)
  })
})
