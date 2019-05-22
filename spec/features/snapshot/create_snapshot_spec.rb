# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create Snapshot' do
  let(:new_screening) do
    {
      id: '1',
      incident_address: {},
      addresses: [],
      cross_reports: [],
      participants: [],
      allegations: [],
      safety_alerts: []
    }
  end

  let(:person) do
    {
      id: '1',
      screening_id: new_screening[:id],
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

  it_behaves_like :authenticated do
    context 'when only snapshot is enabled' do
      around do |example|
        Feature.run_with_deactivated(:screenings) do
          example.run
        end
      end

      scenario 'via start snapshot link' do
        visit root_path(accessCode: access_code)
        click_button 'Start Snapshot'

        expect(page.current_url).to match 'snapshot'

        within '#search-card' do
          expect(page).to have_content('How to Use Snapshot')
        end
      end

      scenario 'user starts a snapshot, goes back to the home page, and starts another snapshot' do
        visit root_path(accessCode: access_code)
        click_button 'Start Snapshot'

        search_response = PersonSearchResponseBuilder.build do |response|
          response.with_total(1)
          response.with_hits do
            [
              PersonSearchResultBuilder.build do |builder|
                builder.with_last_name(person[:last_name])
                builder.with_legacy_descriptor(person[:legacy_descriptor])
              end
            ]
          end
        end

        stub_person_search(person_response: search_response)

        stub_request(
          :get,
          ferb_api_url(
            FerbRoutes.client_authorization_path(
              person.dig(:legacy_descriptor, :legacy_id)
            )
          )
        ).and_return(json_body('', status: 200))

        stub_person_find(
          id: person.dig(:legacy_descriptor, :legacy_id),
          person_response: person
        )

        stub_request(
          :get,
          ferb_api_url(
            FerbRoutes.relationships_path
          ) + "?clientIds=#{person.dig(:legacy_descriptor, :legacy_id)}"
        ).and_return(json_body([].to_json, status: 200))

        stub_empty_history_for_clients [person.dig(:legacy_descriptor, :legacy_id)]

        within '#search-card', text: 'Search' do
          fill_in 'Last Name', with: 'Si'
          click_button 'Search'
        end

        within '.rt-tbody' do
          expect(page).to have_content('Simpson')
        end

        page.driver.go_back

        click_button 'Start Snapshot'

        expect(page).not_to have_css(
          show_participant_card_selector(person.dig(:legacy_descriptor, :legacy_id))
        )
      end

      context 'search results' do
        before(:each) do
          visit root_path(accessCode: access_code)
          click_button 'Start Snapshot'

          search_response = PersonSearchResponseBuilder.build do |response|
            response.with_total(1)
            response.with_hits do
              [
                PersonSearchResultBuilder.build do |builder|
                  builder.with_first_name(person[:last_name])
                  builder.with_legacy_descriptor(person[:legacy_descriptor])
                end
              ]
            end
          end

          stub_person_search(person_response: search_response)

          stub_request(
            :get,
            ferb_api_url(
              FerbRoutes.client_authorization_path(
                person.dig(:legacy_descriptor, :legacy_id)
              )
            )
          ).and_return(json_body('', status: 200))

          stub_person_find(
            id: person.dig(:legacy_descriptor, :legacy_id),
            person_response: person
          )

          stub_request(
            :get,
            ferb_api_url(
              FerbRoutes.relationships_path
            ) + "?clientIds=#{person.dig(:legacy_descriptor, :legacy_id)}"
          ).and_return(json_body([].to_json, status: 200))

          stub_empty_history_for_clients [person.dig(:legacy_descriptor, :legacy_id)]
        end

        scenario 'closes when clicking Start Over button', inaccessible: true do
          within '#search-card', text: 'Search' do
            fill_in 'Last Name', with: 'Si'
            click_button 'Search'
          end
          click_button 'Start Over'

          expect(page).not_to have_content('Simpson')
        end
      end

      scenario 'a new snapshot is created if the user visits the snapshot page directly' do
        visit snapshot_path(accessCode: access_code)
        expect(page).to have_content('Snapshot Search')
      end
    end
  end
end
