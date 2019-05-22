# frozen_string_literal: true

require 'rails_helper'

feature 'Index Page' do
  scenario 'CANS-Worker lands on client list and can logout' do
    login
    expect(page).to have_content('Snapshot')
    logout
  end

  def logout
    visit '/snapshot'
    click_logout
  end

  def login(login_config = default_json)
    visit '/snapshot'
    return unless need_login?

    enter_credentials login_config
  end

  def need_login?
    !page.has_content?('Snapshot', wait: 5)
  end

  def click_logout
    find('.fa-user').click
    find('ul[class="c_dropdown"]').click
  end

  def enter_credentials(login_config = default_json)
    js_script = 'arguments[0].focus();' \
                 'arguments[0].setAttribute("value", arguments[1]);' \
                 'arguments[0].blur();'
    input_field = find('input#username')
    page.execute_script(js_script, input_field.native, JSON.generate(login_config))
    click_button 'Sign In'
  end

  def default_json
    {
      user: 'REGREQD',
      first_name: 'QA02',
      last_name: 'Regression',
      email: 'regressioncares+qa02@gmail.com',
      roles: [
        'CWS-worker', 'SocialWorker'
      ],
      staffId: 'agn',
      county_name: 'Sacramento',
      county_code: '34',
      county_cws_code: 1101,
      privileges: [
        'Resource Mgmt Placement Facility Maint',
        'Countywide Read/Write',
        'Officewide Read',
        'Program Management Reports',
        'County License Case Management',
        'LIS',
        'Non-CWD',
        'CWS Case Management System',
        'Merge Client',
        'Create Service Provider',
        'Sealed',
        'Statewide Read',
        'Resource Management',
        'System Administration',
        'Closed Case/Referral Update',
        'Sensitive Persons',
        'Countywide Read',
        'Adoptions',
        'Officewide Read/Write',
        'CANS-staff-person-clients-read',
        'CANS-client-read',
        'CANS-client-search',
        'CANS-assessment-read',
        'CANS-assessment-create',
        'CANS-assessment-in-progress-update',
        'CANS-assessment-in-progress-delete',
        'CANS-assessment-completed-delete',
        'CANS-assessment-complete',
        'CANS-rollout'
      ],
      authorityCodes: [
        'B'
      ],
      userName: 'd0108753-54cf-4e28-9d3f-1817903f24ad'
    }.to_json
  end
end
