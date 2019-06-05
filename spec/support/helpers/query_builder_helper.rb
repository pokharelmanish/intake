# frozen_string_literal: true

module QueryBuilderHelper
  SIZE = '25'
  TRACK_SCORES = 'true'
  MIN_SCORE = '2.5'

  def sort
    [{ "_score": 'desc', "last_name.keyword": 'asc', "first_name.keyword": 'asc', "_uid": 'desc' }]
  end

  def highlight
    {
      "order": 'score',
      "number_of_fragments": '10',
      "require_field_match": 'false',
      "fields": {
        "autocomplete_search_bar": {
          "matched_fields": [
            'autocomplete_search_bar',
            'autocomplete_search_bar.phonetic',
            'autocomplete_search_bar.diminutive'
          ]
        },
        "searchable_date_of_birth": {}
      }
    }.as_json
  end

  def source
    [
      'id',
      'legacy_source_table',
      'first_name',
      'middle_name',
      'last_name',
      'name_suffix',
      'gender',
      'akas',
      'date_of_birth',
      'date_of_death',
      'ssn',
      'languages',
      'races',
      'ethnicity',
      'client_counties',
      'case_status',
      'addresses.id',
      'addresses.effective_start_date',
      'addresses.street_name',
      'addresses.street_number',
      'addresses.city',
      'addresses.county',
      'addresses.state_code',
      'addresses.zip',
      'addresses.type',
      'addresses.legacy_descriptor',
      'addresses.phone_numbers.number',
      'addresses.phone_numbers.type',
      'csec.start_date',
      'csec.end_date',
      'csec.csec_code_id',
      'csec.description',
      'sp_county',
      'sp_phone',
      'legacy_descriptor',
      'highlight',
      'phone_numbers.id',
      'phone_numbers.number',
      'phone_numbers.type',
      'sensitivity_indicator',
      'race_ethnicity',
      'open_case_responsible_agency_code'
    ]
  end

  def build_query(query)
    {
      size: SIZE,
      track_scores: TRACK_SCORES,
      sort: sort,
      min_score: MIN_SCORE,
      _source: source,
      highlight: highlight,
      query: query
    }
  end
end
