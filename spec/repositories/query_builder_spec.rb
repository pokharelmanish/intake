# frozen_string_literal: true

require 'rails_helper'

describe QueryBuilder do
  let(:person_search_fields_with_client_id) do
    { client_id: '1111-1111-1111-1111111' }
  end

  let(:person_search_fields_with_ssn) do
    { ssn: '123456789' }
  end

  let(:person_search_fields_with_no_name) {}

  let(:person_search_fields_with_last_name_approx_age_years_gender) do
    { last_name: 'last name',
      gender: 'male',
      approximate_age: '100',
      approximate_age_units: 'years',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_name_suffix_approx_age_years_gender) do
    { last_name: 'last name',
      suffix: 'suffix',
      gender: 'male',
      approximate_age: '100',
      approximate_age_units: 'years',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_first_name_suffix) do
    { last_name: 'last name',
      first_name: 'first name',
      suffix: 'suffix' }
  end

  let(:person_search_fields_with_last_first_name) do
    { last_name: 'last name',
      first_name: 'first name' }
  end

  let(:person_search_fields_with_last_first_name_name_suffix_dob) do
    { last_name: 'last name',
      first_name: 'first name',
      suffix: 'suffix',
      date_of_birth: '1989/05/05',
      search_by_age_method: 'dob' }
  end

  let(:person_search_fields_with_last_first_name_suffix_approx_age_months_gender) do
    { last_name: 'last name',
      first_name: 'first name',
      suffix: 'suffix',
      gender: 'female',
      approximate_age: '12',
      approximate_age_units: 'months',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_first_name_suffix_approx_age_years_gender) do
    { last_name: 'last name',
      first_name: 'first name',
      suffix: 'suffix',
      gender: 'male',
      approximate_age: '100',
      approximate_age_units: 'years',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_first_name_approx_age_months_gender) do
    { last_name: 'last name',
      first_name: 'first name',
      gender: 'female',
      approximate_age: '12',
      approximate_age_units: 'months',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_middle_first_name_suffix_approx_age_years_gender) do
    { last_name: 'last name',
      first_name: 'first name',
      middle_name: 'middle name',
      suffix: 'suffix',
      gender: 'male',
      approximate_age: '100',
      approximate_age_units: 'years',
      search_by_age_method: 'approximate' }
  end

  let(:person_search_fields_with_last_middle_first_name_approx_age_months_gender) do
    { last_name: 'last name',
      first_name: 'first name',
      middle_name: 'middle name',
      gender: 'female',
      approximate_age: '12',
      approximate_age_units: 'months',
      search_by_age_method: 'approximate' }
  end

  let(:ssn_only_query) { PersonSearchResultBuilder.new.ssn_only_query }
  let(:client_id_only_query) { PersonSearchResultBuilder.new.client_id_only_query }
  let(:no_name_query) { PersonSearchResultBuilder.new.fs_no_name_query }
  let(:last_name_approx_age_years_gender_query) do
    PersonSearchResultBuilder.new.fs_last_name_approx_age_years_gender_query
  end
  let(:last_name_suffix_approx_age_years_gender_query) do
    PersonSearchResultBuilder.new.fs_last_name_suffix_approx_age_years_gender_query
  end
  let(:last_and_first_name_with_suffix_query) do
    PersonSearchResultBuilder.new.fs_last_and_first_name_with_suffix_query
  end
  let(:last_and_first_name_query) do
    PersonSearchResultBuilder.new.fs_last_and_first_name_query
  end
  let(:last_first_name_with_suffix_dob_query) do
    PersonSearchResultBuilder.new.fs_last_first_name_with_suffix_dob_query
  end
  let(:last_first_name_with_suffix_approx_age_months_gender_query) do
    PersonSearchResultBuilder.new.fs_last_first_name_with_suffix_approx_age_months_gender_query
  end
  let(:last_first_name_with_suffix_approx_age_years_gender_query) do
    PersonSearchResultBuilder.new.fs_last_first_name_with_suffix_approx_age_years_gender_query
  end
  let(:last_first_name_approx_age_months_gender_query) do
    PersonSearchResultBuilder.new.fs_last_first_name_approx_age_months_gender_query
  end
  let(:last_middle_first_name_with_suffix_approx_age_years_gender_query) do
    PersonSearchResultBuilder
      .new.fs_last_middle_first_name_with_suffix_approx_age_years_gender_query
  end
  let(:last_middle_first_name_approx_age_months_gender_query) do
    PersonSearchResultBuilder.new.fs_last_middle_first_name_approx_age_months_gender_query
  end

  describe '.is_client_only?' do
    context 'is_client_only is true' do
      it 'return true' do
        qb = described_class.build(search_term: 'hello', is_client_only: 'true')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return true' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return false' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.is_client_only).to be false
      end
    end
  end

  describe '.must' do
    context 'is_client_only is true' do
      before(:each) do
        Rails.configuration.intake[:client_only_search] = true
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.build(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last.as_json).to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.build(search_term: 'hello')
        expect(qb.must.last.as_json).to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.build(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.last.as_json).to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end
    end

    context 'is_client_only is false' do
      before(:each) do
        Rails.configuration.intake[:client_only_search] = false
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.build(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last.as_json).to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.build(search_term: 'hello')
        expect(qb.must.last.as_json).to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.build(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.as_json).not_to  \
          include({ match: { "legacy_descriptor.legacy_table_name": 'CLIENT_T' } }.as_json)
      end
    end
  end

  describe '.build_query' do
    context 'when search_after is not present and searching clients only' do
      let(:search_after) { nil }

      it 'builds a person search query without search_after' do
        query = described_class.new(search_after: search_after)
                               .build_query

        expect(query[:search_after]).to eq search_after
      end
    end

    context 'when search_after is present and searching all participants' do
      let(:search_after) { %w[one two] }

      it 'builds a person search query with search_after' do
        query = described_class.new(search_after: search_after).build_query
        expect(query[:search_after]).to eq search_after
      end
    end

    context 'when the size parameter is not the default size of 25' do
      let(:size) { '10' }

      it 'builds a person search query that returns a max of 10 results' do
        query = described_class.new(size: size).build_query
        expect(query[:size]).to eq size
      end
    end
  end

  describe '#build' do
    context 'when client_id is present' do
      it 'returns query with client id only' do
        result = described_class.build(
          person_search_fields: person_search_fields_with_client_id,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq client_id_only_query['_source']
        expect(result['size']).to eq client_id_only_query['size']
        expect(result['sort']).to eq client_id_only_query['sort']
        expect(result['track_scores']).to eq client_id_only_query['track_scores']
        expect(result['query']).to eq client_id_only_query['query']
      end
    end

    context 'when advanced search feature flag is on' do
      it 'returns query with no name' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_no_name,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq no_name_query['_source']
        expect(result['size']).to eq no_name_query['size']
        expect(result['sort']).to eq no_name_query['sort']
        expect(result['track_scores']).to eq no_name_query['track_scores']
        expect(result['query']).to eq no_name_query['query']
      end

      it 'returns query with last name, approx age in years, and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_last_name_approx_age_years_gender,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq last_name_approx_age_years_gender_query['_source']
        expect(result['size']).to eq last_name_approx_age_years_gender_query['size']
        expect(result['sort']).to eq last_name_approx_age_years_gender_query['sort']
        expect(result['track_scores']).to eq last_name_approx_age_years_gender_query['track_scores']
        expect(result['query']).to eq last_name_approx_age_years_gender_query['query']
      end

      it 'returns query with last name, suffix, approx age in years, and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_last_name_suffix_approx_age_years_gender,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq last_name_suffix_approx_age_years_gender_query['_source']
        expect(result['size']).to eq last_name_suffix_approx_age_years_gender_query['size']
        expect(result['sort']).to eq last_name_suffix_approx_age_years_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_name_suffix_approx_age_years_gender_query['track_scores']
        expect(result['query']).to eq last_name_suffix_approx_age_years_gender_query['query']
      end

      it 'returns query with last and first name, with suffix' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_last_first_name_suffix,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq last_and_first_name_with_suffix_query['_source']
        expect(result['size']).to eq last_and_first_name_with_suffix_query['size']
        expect(result['sort']).to eq last_and_first_name_with_suffix_query['sort']
        expect(result['track_scores']).to eq last_and_first_name_with_suffix_query['track_scores']
        expect(result['query']).to eq last_and_first_name_with_suffix_query['query']
      end

      it 'returns query with last and first name' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_last_first_name,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq last_and_first_name_query['_source']
        expect(result['size']).to eq last_and_first_name_query['size']
        expect(result['sort']).to eq last_and_first_name_query['sort']
        expect(result['track_scores']).to eq last_and_first_name_query['track_scores']
        expect(result['query']).to eq last_and_first_name_query['query']
      end

      it 'returns query with last and first name, with suffix, and date of birth' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields: person_search_fields_with_last_first_name_name_suffix_dob,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq last_first_name_with_suffix_dob_query['_source']
        expect(result['size']).to eq last_first_name_with_suffix_dob_query['size']
        expect(result['sort']).to eq last_first_name_with_suffix_dob_query['sort']
        expect(result['track_scores']).to eq last_first_name_with_suffix_dob_query['track_scores']
        expect(result['query']).to eq last_first_name_with_suffix_dob_query['query']
      end

      it 'returns query with last first name, suffix, approx age in months and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields:
            person_search_fields_with_last_first_name_suffix_approx_age_months_gender,
          size: '25'
        ).payload.as_json
        expect(
          result['_source']
        ).to eq last_first_name_with_suffix_approx_age_months_gender_query['_source']
        expect(
          result['size']
        ).to eq last_first_name_with_suffix_approx_age_months_gender_query['size']
        expect(
          result['sort']
        ).to eq last_first_name_with_suffix_approx_age_months_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_first_name_with_suffix_approx_age_months_gender_query['track_scores']
        expect(
          result['query']
        ).to eq last_first_name_with_suffix_approx_age_months_gender_query['query']
      end

      it 'returns query with last first name, suffix, approx age in years and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields:
            person_search_fields_with_last_first_name_suffix_approx_age_years_gender,
          size: '25'
        ).payload.as_json
        expect(
          result['_source']
        ).to eq last_first_name_with_suffix_approx_age_years_gender_query['_source']
        expect(
          result['size']
        ).to eq last_first_name_with_suffix_approx_age_years_gender_query['size']
        expect(
          result['sort']
        ).to eq last_first_name_with_suffix_approx_age_years_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_first_name_with_suffix_approx_age_years_gender_query['track_scores']
        expect(
          result['query']
        ).to eq last_first_name_with_suffix_approx_age_years_gender_query['query']
      end

      it 'returns query with last and first name, approx age in months, and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields:
            person_search_fields_with_last_first_name_approx_age_months_gender,
          size: '25'
        ).payload.as_json
        expect(
          result['_source']
        ).to eq last_first_name_approx_age_months_gender_query['_source']
        expect(result['size']).to eq last_first_name_approx_age_months_gender_query['size']
        expect(result['sort']).to eq last_first_name_approx_age_months_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_first_name_approx_age_months_gender_query['track_scores']
        expect(
          result['query']
        ).to eq last_first_name_approx_age_months_gender_query['query']
      end

      it 'returns query with last middle and first name, suffix, approx age in years and gender' do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields:
            person_search_fields_with_last_middle_first_name_suffix_approx_age_years_gender,
          size: '25'
        ).payload.as_json
        expect(
          result['_source']
        ).to eq last_middle_first_name_with_suffix_approx_age_years_gender_query['_source']
        expect(
          result['size']
        ).to eq last_middle_first_name_with_suffix_approx_age_years_gender_query['size']
        expect(
          result['sort']
        ).to eq last_middle_first_name_with_suffix_approx_age_years_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_middle_first_name_with_suffix_approx_age_years_gender_query['track_scores']
        expect(
          result['query']
        ).to eq last_middle_first_name_with_suffix_approx_age_years_gender_query['query']
      end

      it('returns query with last, middle, and first name, and approx age in months, and gender') do
        result = described_class.build(
          is_advanced_search_on: 'true',
          person_search_fields:
            person_search_fields_with_last_middle_first_name_approx_age_months_gender,
          size: '25'
        ).payload.as_json
        expect(
          result['_source']
        ).to eq last_middle_first_name_approx_age_months_gender_query['_source']
        expect(result['size']).to eq last_middle_first_name_approx_age_months_gender_query['size']
        expect(result['sort']).to eq last_middle_first_name_approx_age_months_gender_query['sort']
        expect(
          result['track_scores']
        ).to eq last_middle_first_name_approx_age_months_gender_query['track_scores']
        expect(result['query']).to eq last_middle_first_name_approx_age_months_gender_query['query']
      end
    end

    context 'when ssn is present' do
      it 'returns query with ssn only' do
        result = described_class.build(
          person_search_fields: person_search_fields_with_ssn,
          size: '25'
        ).payload.as_json
        expect(result['_source']).to eq ssn_only_query['_source']
        expect(result['size']).to eq ssn_only_query['size']
        expect(result['sort']).to eq ssn_only_query['sort']
        expect(result['track_scores']).to eq ssn_only_query['track_scores']
        expect(result['query']).to eq ssn_only_query['query']
      end
    end
  end

  describe '.formatted_query' do
    context 'when the search term includes date of birth' do
      it 'filters out slashes in the date of birth' do
        search_terms = [
          '01/02/2001',
          '02/2001',
          '2001',
          '01/02',
          '1/2/2001',
          '2/2001',
          '1/2'
        ]
        expected_results = %w[
          01022001
          022001
          2001
          0102
          122001
          22001
          12
        ]
        search_terms.each_with_index do |search_term, index|
          result = described_class.new.formatted_query(search_term)
          expect(result).to eq expected_results[index]
        end
      end

      it 'filters out dashes' do
        search_terms = [
          '01-02-2001',
          '02-2001',
          '2001',
          '01-02',
          '1-2-2001',
          '2-2001',
          '1-2'
        ]
        expected_results = %w[
          01022001
          022001
          2001
          0102
          122001
          22001
          12
        ]
        search_terms.each_with_index do |search_term, index|
          result = described_class.new.formatted_query(search_term)
          expect(result).to eq expected_results[index]
        end
      end

      it 'keeps apostrophes and slashes in the name' do
        search_term = "A/li'son Juniper 01/02"
        expected_search_term = "a/li'son juniper 0102"

        result = described_class.new.formatted_query(search_term)
        expect(result).to eq expected_search_term
      end

      it 'removes slashes in date times as the user is typing' do
        search_terms = [
          '0',
          '01',
          '01/',
          '01/0',
          '01/02',
          '01/02/',
          '01/02/1',
          '01/02/19',
          '01/02/199',
          '01/02/1995',
          '//0/1/0//2/1/9/9/5//',
          '1',
          '1/',
          '1/2',
          '1/2/',
          '1/2/1',
          '1/2/19',
          '1/2/199',
          '1/2/1995'
        ]
        expected_results = %w[
          0
          01
          01
          010
          0102
          0102
          01021
          010219
          0102199
          01021995
          01021995
          1
          1
          12
          12
          121
          1219
          12199
          121995
        ]
        search_terms.each_with_index do |search_term, index|
          result = described_class.new.formatted_query(search_term)
          expect(result).to eq expected_results[index]
        end
      end
    end
  end
end
