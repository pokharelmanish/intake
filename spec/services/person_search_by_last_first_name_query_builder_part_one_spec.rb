# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchByLastFirstNameQueryBuilderPartOne do
  describe '.build_query' do
    let(:last_name) { 'last name' }
    let(:first_name) { 'first name' }
    let(:suffix) { 'suffix' }

    let(:no_name_query) { PersonSearchResultBuilder.new.fs_no_name_query_part_one }
    let(:last_first_name_with_suffix_query) do
      PersonSearchResultBuilder.new.fs_last_first_name_with_suffix_query_part_one
    end
    let(:last_first_name_query) do
      PersonSearchResultBuilder.new.fs_last_first_name_query_part_one
    end

    let(:no_name_params) {}
    let(:last_first_name_with_suffix_params) do
      {
        last_name: last_name,
        first_name: first_name,
        suffix: suffix
      }
    end
    let(:last_first_name_params) do
      {
        last_name: last_name,
        first_name: first_name
      }
    end

    context 'returns hash' do
      it 'with no name query' do
        query_builder = QueryBuilder.new(person_search_fields: no_name_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq no_name_query['query']
      end
    end

    context 'returns hash' do
      it 'with last, first name with suffix query' do
        query_builder = QueryBuilder.new(person_search_fields: last_first_name_with_suffix_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq last_first_name_with_suffix_query['query']
      end
    end

    context 'returns hash' do
      it 'with last, first name query' do
        query_builder = QueryBuilder.new(person_search_fields: last_first_name_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq last_first_name_query['query']
      end
    end
  end
end
