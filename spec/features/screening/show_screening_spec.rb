# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Show Screening' do
  let(:existing_screening) do
    {
      id: '1',
      additional_information: 'The reasoning for this decision',
      incident_address: {
        id: '1',
        street_address: '123 fake st',
        city: 'Springfield',
        state: 'NY',
        zip: '12345'
      },
      addresses: [],
      participants: [],
      allegations: [],
      safety_alerts: [],
      assignee: 'Bob Loblaw',
      report_type: 'csec',
      communication_method: 'mail',
      ended_at: '2016-08-22T11:00:00.000Z',
      incident_county: '34',
      incident_date: '2016-08-11',
      location_type: "Child's Home",
      name: 'The Rocky Horror Picture Show',
      reference: 'My Bad!',
      report_narrative: 'some narrative',
      screening_decision: 'screen_out',
      screening_decision_detail: 'consultation',
      started_at: '2016-08-13T10:00:00.000Z',
      cross_reports: [
        {
          county_id: '1077',
          agencies: [
            { id: '1', code: '45Hvp7x00F', type: 'DISTRICT_ATTORNEY' },
            { id: '2', type: 'COUNTY_LICENSING' }
          ]
        }
      ]
    }
  end

  scenario 'showing existing screening' do
    stub_county_agencies('1077')
    stub_request(
      :get, ferb_api_url(FerbRoutes.intake_screening_path(existing_screening[:id]))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships
    stub_empty_history_for_screening(existing_screening)

    visit screening_path(id: existing_screening[:id])
    within '.page-header-mast' do
      expect(page).to have_content('The Rocky Horror Picture Show')
    end

    within '#screening-information-card.show', text: 'Screening Information' do
      expect(page.find('div.show-label', text: 'Assigned Social Worker')[:class])
        .to include('required')
      expect(page.find('div.show-label', text: 'Screening Start Date/Time')[:class])
        .to include('required')
      expect(page.find('div.show-label', text: 'Communication Method')[:class])
        .to include('required')
      expect(page).to have_content 'The Rocky Horror Picture Show'
      expect(page).to have_content 'Bob Loblaw'
      expect(page).to have_content 'Commercially Sexually Exploited Children (CSEC)'
      expect(page).to have_content '8/13/2016 3:00 AM'
      expect(page).to have_content '8/22/2016 4:00 AM'
      expect(page).to have_content 'Mail'
    end

    within '#narrative-card.show', text: 'Narrative' do
      expect(page).to have_content 'some narrative'
      expect(page.find('div.show-label', text: 'Report Narrative')[:class]).to include('required')
    end

    within '#incident-information-card.show', text: 'Incident Information' do
      expect(page).to have_content '8/11/2016'
      expect(page).to have_content 'Sacramento'
      expect(page).to have_content '123 fake st'
      expect(page).to have_content 'Springfield'
      expect(page).to have_content 'New York'
      expect(page).to have_content '12345'
      expect(page).to have_content "Child's Home"
    end

    within '#decision-card.show', text: 'Decision' do
      expect(page.find('div.show-label', text: 'Screening Decision')[:class]).to include('required')
      expect(page).to have_content 'Screen out'
      expect(page).to have_content 'Category'
      expect(page).to have_content 'Consultation'
      expect(page).to have_content 'The reasoning for this decision'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_css('th', text: 'Alleged Victim/Children')
      expect(page).to have_css('th', text: 'Alleged Perpetrator')
      expect(page).to have_css('th', text: 'Allegation(s)')
    end

    within '#worker-safety-card', text: 'Worker Safety' do
      expect(page).to have_link('Edit')
      expect(page).to have_content('Worker Safety Alerts')
      expect(page).to have_content('Additional Safety Information')
    end

    expect(page).to have_css('#history-card.show', text: 'History')

    within '#cross-report-card', text: 'Cross Report' do
      expect(page).to have_content 'District Attorney'
      expect(page).to have_content 'LA District Attorney'
      expect(page).to have_content 'County Licensing'
      click_link 'Edit cross report'
      expect(page).to have_select('District Attorney Agency Name', selected: 'LA District Attorney')
    end

    expect(page).to have_link('Home', href: root_path)
    expect(page).to have_link('Edit', href: edit_screening_path(id: existing_screening[:id]))
  end

  context 'when screenings are disabled' do
    around do |example|
      Feature.run_with_deactivated(:screenings) do
        example.run
      end
    end

    scenario 'cannot view an existing screening' do
      stub_request(
        :get, ferb_api_url(FerbRoutes.intake_screening_path(existing_screening[:id]))
      ).and_return(json_body(existing_screening.to_json))
      stub_empty_relationships
      stub_empty_history_for_screening(existing_screening)
      visit screening_path(id: existing_screening[:id])

      expect(page).to have_content('Sorry, this is not the page you want')
    end
  end

  context 'when a screening has already been submitted as a referral' do
    let(:existing_screening) do
      {
        id: '1',
        referral_id: '123ABC',
        additional_information: 'The reasoning for this decision',
        incident_address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        },
        assignee: 'Bob Loblaw',
        report_type: 'csec',
        communication_method: 'mail',
        ended_at: '2016-08-22T11:00:00.000Z',
        incident_county: '34',
        incident_date: '2016-08-11',
        location_type: "Child's Home",
        name: 'The Rocky Horror Picture Show',
        reference: 'My Bad!',
        report_narrative: 'some narrative',
        screening_decision: 'screen_out',
        screening_decision_detail: 'consultation',
        started_at: '2016-08-13T10:00:00.000Z',
        cross_reports: [{
          id: '1',
          county_id: '1077',
          agencies: [
            { type: 'DISTRICT_ATTORNEY', id: '45Hvp7x00F' },
            { type: 'COUNTY_LICENSING' }
          ]
        }],
        allegations: [],
        safety_alerts: []
      }
    end

    before do
      stub_county_agencies('1077')
      existing_screening[:participants] = Array.new(3) do
        FactoryBot.create(
          :participant,
          screening_id: existing_screening[:id]
        ).as_json.symbolize_keys
      end
    end

    scenario 'the screening is in read only mode' do
      stub_request(
        :get,
        ferb_api_url(FerbRoutes.intake_screening_path(existing_screening[:id]))
      ).and_return(json_body(existing_screening.to_json))
      stub_empty_relationships
      stub_empty_history_for_screening(existing_screening)

      visit screening_path(id: existing_screening[:id])
      within '.page-header-mast' do
        expect(page).to have_content('The Rocky Horror Picture Show')
      end
      expect(page).to have_content "Referral ##{existing_screening[:referral_id]}"
      expect(page).to_not have_css('#search-card', text: 'Search')
      expect(page).to_not have_css('.card.edit')
      expect(page).not_to have_button 'Submit'
      expect(page).not_to have_link 'Edit'
      expect(page).not_to have_link 'Save'
      expect(page).not_to have_link 'Cancel'
      expect(page).not_to have_selector '.delete-button'
    end
  end
end
