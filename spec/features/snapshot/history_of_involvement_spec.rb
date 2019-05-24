# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Snapshot History of Involvement' do
  let(:person) do
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

  let(:screenings) do
    [
      {
        id: '1234',
        start_date: '2016-09-10',
        county_name: 'el_dorado',
        assigned_social_worker: { first_name: nil, last_name: 'Bob Smith' },
        reporter: { first_name: 'Alex', last_name: 'Hanson' },
        all_people: [
          { first_name: nil, last_name: 'Bob Smith', roles: ['Assigned Social Worker'] },
          { first_name: 'Alex', last_name: 'Hanson', roles: ['Reporter'] },
          { first_name: 'Sally', last_name: 'Johnson', roles: ['Victim'] },
          { first_name: 'Sam', last_name: 'Anderson', roles: ['Perpetrator'] },
          { first_name: 'James', last_name: 'Robinson', roles: [] }
        ]
      },
      {
        start_date: '2016-08-10',
        end_date: '2016-11-12',
        county_name: 'el_dorado',
        reporter: { first_name: nil, last_name: nil },
        assigned_social_worker: { first_name: nil, last_name: nil },
        all_people: []
      }
    ]
  end

  let(:referrals) do
    [
      {
        id: '1234',
        start_date: '2016-11-14',
        end_date: '2016-12-14',
        county: {
          description: 'Madera',
          id: '1087'
        },
        response_time: 'Immediate',
        reporter: {
          first_name: 'Reporter1',
          last_name: 'r1LastName'
        },
        assigned_social_worker: {
          first_name: 'Social1',
          last_name: 's1LastName'
        },
        allegations: [{
          type: {
            id: '2178',
            description: 'General Neglect'
          },
          disposition: {
            id: '1',
            description: 'Entered in Error'
          },
          victim: {
            first_name: 'Victim1',
            last_name: 'v1LastName'
          },
          perpetrator: {
            first_name: 'Perpetrator1',
            last_name: 'p1LastName'
          }
        }],
        legacy_descriptor: {
          legacy_ui_id: '0853-2115-5670-6000802'
        },
        access_limitation: { limited_access_code: 'R' }
      },
      {
        start_date: '2016-05-06',
        county: {
          id: '1',
          description: 'San Francisco'
        },
        reporter: {
          first_name: 'Reporter2',
          last_name: 'r2LastName'
        },
        assigned_social_worker: {
          first_name: 'Social2',
          last_name: 's2LastName'
        },
        allegations: [{
          type: {
            id: '2179',
            description: 'Severe Neglect'
          },
          disposition: {
            id: '0'
          },
          perpetrator: {
            first_name: 'Perpetrator2',
            last_name: 'p2LastName'
          },
          victim: {
            first_name: 'Victim2',
            last_name: 'v2LastName'
          }
        }],
        legacy_descriptor: {
          legacy_ui_id: '0202-9769-1248-2000283'
        },
        access_limitation: { limited_access_code: 'S' }
      }
    ]
  end

  let(:cases) do
    [
      {
        start_date: '2016-01-01',
        end_date: '2016-11-01',
        focus_child: {
          last_name: 'fc1Last',
          id: '0rumtwQ0Bn',
          first_name: 'fChild1'
        },
        county: {
          id: '456',
          description: 'El Dorado'
        },
        service_component: {
          id: '123',
          description: 'Family Reunification'
        },
        parents: [
          { first_name: 'Parent1', last_name: 'p1Last', id: 'AbiQA5q0Bo' },
          { first_name: 'Parent2', last_name: 'p2Last', id: 'CaTvuzq0Bo' }
        ],
        assigned_social_worker: {
          last_name: 'sw1LastName',
          first_name: 'SocialWorker1'
        },
        legacy_descriptor: {
          legacy_ui_id: '0393-5909-1798-6027230'
        },
        access_limitation: { limited_access_code: 'R' }
      },
      {
        start_date: '2016-02-03',
        focus_child: {
          last_name: 'fc2Last',
          id: '1234567',
          first_name: 'fChild2'
        },
        county: {
          id: '457',
          description: 'Plumas'
        },
        parents: [
          { first_name: 'Parent3', last_name: 'p3Last', id: 'ABC123' },
          { first_name: 'Parent4', last_name: 'p4Last', id: 'ABCDEFG' }
        ],
        assigned_social_worker: {
          last_name: 'sw2LastName',
          first_name: 'SocialWorker2'
        },
        legacy_descriptor: {
          legacy_ui_id: '0208-9997-9274-0000863'
        },
        access_limitation: { limited_access_code: 'N' }
      }
    ]
  end

  let(:history) do
    {
      referrals: referrals,
      screenings: screenings,
      cases: cases
    }
  end

  before(:each) do
    stub_system_codes
  end

  context 'with no history of involvements' do
    around do |example|
      Feature.run_with_activated(:release_two, :advanced_search) do
        example.run
      end
    end

    before(:each) do
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

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.relationships_path
        ) + "?clientIds=#{person.dig(:legacy_descriptor, :legacy_id)}"
      ).and_return(json_body([].to_json, status: 200))

      stub_empty_history_for_clients([person.dig(:legacy_descriptor, :legacy_id)])

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

      visit snapshot_path

      within '#search-card', text: 'Search' do
        fill_in 'Last Name', with: 'Si'
        click_button 'Search'
      end

      within '#person-search-results-card' do
        click_link 'Simpson'
      end
    end

    scenario 'snapshot detail page displays the no HOI copy' do
      within '#history-card.card.show' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end
  end

  context 'a snapshot with HOI from FERB' do
    around do |example|
      Feature.run_with_activated(:release_two, :advanced_search) do
        example.run
      end
    end

    before(:each) do
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

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.relationships_path
        ) + "?clientIds=#{person.dig(:legacy_descriptor, :legacy_id)}"
      ).and_return(json_body([].to_json, status: 200))

      stub_request(
        :get,
        ferb_api_url(
          FerbRoutes.history_of_involvements_path
        ) + "?clientIds=#{person.dig(:legacy_descriptor, :legacy_id)}"
      ).and_return(json_body(history.to_json, status: 200))

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

      visit snapshot_path

      within '#search-card', text: 'Search' do
        fill_in 'Last Name', with: 'Si'
        click_button 'Search'
      end

      within '#person-search-results-card' do
        click_link 'Simpson'
      end
    end

    scenario 'should return history card' do
      within '#history-card' do
        expect(page).to have_content('History')
        expect(page)
          .not_to have_content('Search for people and add them to see their child welfare history.')
        expect(page).to have_content('Madera')
        expect(page).to have_content('San Francisco')
        expect(page).to have_content('El Dorado')
        expect(page).to have_content('Plumas')
      end
    end
  end
end
