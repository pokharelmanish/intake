# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Search results page' do
  around do |example|
    Feature.run_with_activated(:release_two, :advanced_search) do
      example.run
    end
  end

  let(:participant) do
    {
      first_name: 'Juan',
      last_name: 'Simpson',
      gender: 'male',
      ssn: '',
      roles: [],
      addresses: [{
        messages: [],
        type: 'Placement Home',
        street_number: '500',
        street_name: 'El Camino Real',
        city: 'Santa Clara',
        state: 'CA',
        zip: '95053',
        phone_numbers: [{ id: '1', type: 'Home', number: '(971) 287-6774' }],
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
        phone_numbers: [{ id: '1', type: 'Home', number: '(971) 287-6774' }],
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

  before(:each) do
    stub_system_codes
    stub_empty_history_for_clients [participant.dig(:legacy_descriptor, :legacy_id)]
    stub_request(
      :get,
      ferb_api_url(
        FerbRoutes.relationships_path
      ) + "?clientIds=#{participant.dig(:legacy_descriptor, :legacy_id)}"
    ).and_return(json_body([].to_json, status: 200))

    search_response = PersonSearchResponseBuilder.build do |response|
      response.with_total(1)
      response.with_hits do
        [
          PersonSearchResultBuilder.build do |builder|
            builder.with_first_name(participant[:first_name])
            builder.with_legacy_descriptor(participant[:legacy_descriptor])
            builder.with_last_name(participant[:last_name])
            builder.with_phone_number(participant[:phone_numbers].first)
            builder.with_addresses do
              [
                AddressSearchResultBuilder.build do |address|
                  address.with_street_number(participant[:addresses][0][:street_number])
                  address.with_street_name(participant[:addresses][0][:street_name])
                  address.with_state_code(participant[:addresses][0][:state])
                  address.with_city(participant[:addresses][0][:city])
                  address.with_zip(participant[:addresses][0][:zip])
                  address.with_phone_number(participant[:addresses][0][:phone_numbers].first)
                  address.with_type do
                    AddressTypeSearchResultBuilder.build('Home')
                  end
                  address.with_phone_number(participant[:phone_numbers].first)
                end
              ]
            end
            builder.with_gender(participant[:gender])
            builder.with_date_of_birth(participant[:date_of_birth])
            builder.with_ssn(participant[:ssn])
            builder.with_race_and_ethnicity do
              RaceEthnicitySearchResultBuilder.build do |race_ethnicity|
                race_ethnicity.with_race_codes do
                  [
                    RaceCodesSearchResultBuilder.build('Unable to Determine')
                  ]
                end
              end
            end
          end
        ]
      end
    end

    stub_person_search(person_response: search_response)
    stub_request(
      :get,
      ferb_api_url(
        FerbRoutes.client_authorization_path(
          participant.dig(:legacy_descriptor, :legacy_id)
        )
      )
    ).and_return(json_body('', status: 200))
    stub_person_find(id: participant.dig(:legacy_descriptor, :legacy_id),
                     person_response: participant)
  end

  scenario 'Display search results grid' do
    visit snapshot_path

    within '#search-card', text: 'Search' do
      fill_in 'Last Name', with: 'Si'
      click_button 'Search'
    end

    within '.rt-tbody' do
      expect(page).to have_content('Juan Simpson')
      expect(page).to have_content('Male')
      expect(page).to have_content('500 El Camino Real, Santa Clara, CA 95053')
    end
  end

  scenario 'Clicking Start Over removes people from the snapshot page' do
    visit snapshot_path

    within '#search-card', text: 'Search' do
      fill_in 'Last Name', with: 'Si'
      click_button 'Search'
    end

    within '.rt-tbody' do
      expect(page).to have_content('Juan Simpson')
    end

    click_button 'Start Over'

    expect(page).not_to have_content('Juan Simpson')
  end
end
