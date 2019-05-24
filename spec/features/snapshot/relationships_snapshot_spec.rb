# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Snapshot relationship card' do
  let(:participant) do
    {
      id: '1',
      first_name: 'Juan',
      last_name: 'Simpson',
      gender: 'female',
      ssn: '',
      roles: [],
      addresses: [{
        messages: [],
        type: 'Placement Home',
        street_address: 'P.O. Box 162',
        city: 'Pala',
        state: 'CA',
        zip: '92089',
        legacy_descriptor: {
          legacy_id: '7OFBh9m2St',
          legacy_ui_id: '0419-8132-6960-2009479',
          legacy_last_updated: '1998-01-02T10:09:29.000-0800',
          legacy_table_name: 'PLC_HM_T',
          legacy_table_description: 'Placement Home'
        }
      }, {
        messages: [],
        type: 'Home',
        street_address: '6321 Di Loreto Point',
        city: 'San Diego',
        state: 'CA',
        zip: '0',
        legacy_descriptor: {
          legacy_id: 'C9dNEEl0AB',
          legacy_ui_id: '0690-4298-3587-5000631',
          legacy_last_updated: '1999-11-19T10:24:06.637-0800',
          legacy_table_name: 'ADDRS_T',
          legacy_table_description: 'Address'
        }
      }],
      races: [{ race: 'American Indian or Alaska Native', race_detail: 'American Indian' },
              { race: 'Asian', race_detail: 'Chinese' }],
      ethnicity: [{ hispanic_latino_origin: 'No', ethnicity_detail: [] }],
      middle_name: '',
      name_suffix: '',
      approximate_age: '30',
      approximate_age_units: 'years',
      languages: ['English', 'American Sign Language'],
      phone_numbers: [{ id: '1', number: '(971) 287-6774' }],
      sealed: false,
      sensitive: false,
      probation_youth: false,
      legacy_descriptor: {
        legacy_id: '1234567890',
        legacy_ui_id: '1621-3598-1936-3000631',
        legacy_last_updated: '1999-11-23T12:45:34.372-0800',
        legacy_table_name: 'CLIENT_T',
        legacy_table_description: 'Client'
      },
      csec: []
    }
  end

  let(:relationships) do
    [
      {
        id: participant[:id],
        first_name: participant[:first_name],
        last_name: participant[:last_name],
        relationships: [{
          related_person_id: nil,
          related_person_legacy_id: '789',
          related_person_first_name: 'Jake',
          related_person_last_name: 'Campbell',
          relationship: 'Sister/Brother (Half)',
          related_person_relationship: '18',
          indexed_person_relationship: '277',
          relationship_context: 'Half'
        }, {
          related_person_id: nil,
          related_person_legacy_id: '156',
          related_person_first_name: 'Jane',
          related_person_last_name: 'Campbell',
          relationship: 'Sister/Sister (Half)',
          related_person_relationship: '280',
          indexed_person_relationship: '280',
          relationship_context: 'Half'
        }, {
          related_person_id: nil,
          related_person_legacy_id: '808',
          related_person_first_name: 'John',
          related_person_last_name: 'Florence',
          related_person_name_suffix: 'phd.',
          relationship: 'Sister/Brother (Half)',
          related_person_relationship: '18',
          indexed_person_relationship: '277',
          relationship_context: 'Half'
        }]
      }
    ]
  end

  before(:each) do
    stub_system_codes
  end

  context 'with no relationships' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    before(:each) do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_last_name(participant[:last_name])
              builder.with_legacy_descriptor(participant[:legacy_descriptor])
            end
          ]
        end
      end

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.relationships_path
        ) + "?clientIds=#{participant.dig(:legacy_descriptor, :legacy_id)}"
      ).and_return(json_body([].to_json, status: 200))

      stub_empty_history_for_clients([participant.dig(:legacy_descriptor, :legacy_id)])

      stub_person_search(person_response: search_response)

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.client_authorization_path(
            participant.dig(:legacy_descriptor, :legacy_id)
          )
        )
      ).and_return(json_body('', status: 200))

      stub_person_find(
        id: participant.dig(:legacy_descriptor, :legacy_id),
        person_response: participant
      )

      visit snapshot_path

      within '#search-card', text: 'Search' do
        fill_in 'Last Name', with: 'Si'
        click_button 'Search'
      end

      within '#person-search-results-card' do
        click_link 'Simpson'
      end
    end

    scenario 'snapshot displays the no relationships copy' do
      within '#relationships-card.card.show' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end
  end

  context 'load relationships' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    before(:each) do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_last_name(participant[:last_name])
              builder.with_legacy_descriptor(participant[:legacy_descriptor])
            end
          ]
        end
      end

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.relationships_path
        ) + "?clientIds=#{participant.dig(:legacy_descriptor, :legacy_id)}"
      ).and_return(json_body(relationships.to_json, status: 200))

      stub_empty_history_for_clients([participant.dig(:legacy_descriptor, :legacy_id)])

      stub_person_search(person_response: search_response)

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.client_authorization_path(
            participant.dig(:legacy_descriptor, :legacy_id)
          )
        )
      ).and_return(json_body('', status: 200))

      stub_person_find(
        id: participant.dig(:legacy_descriptor, :legacy_id),
        person_response: participant
      )

      visit snapshot_path

      within '#search-card', text: 'Search' do
        fill_in 'Last Name', with: 'Si'
        click_button 'Search'
      end

      within '#person-search-results-card' do
        click_link 'Simpson'
      end
    end

    scenario 'should return relationships card' do
      within '#relationships-card' do
        expect(page).to have_content('Relationship')
        expect(page)
          .not_to have_content('Search for people and add them to see their relationships.')
        expect(page).to have_content('Jake Campbell')
        expect(page).to have_content('Jane Campbell')
        expect(page).to have_content('John Florence, PhD')
      end
    end
  end
end
