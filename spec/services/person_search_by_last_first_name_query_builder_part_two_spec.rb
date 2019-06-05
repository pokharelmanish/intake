# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchByLastFirstNameQueryBuilderPartTwo do
  describe '.build_query' do
    let(:last_name) { 'last name' }
    let(:first_name) { 'first name' }

    let(:no_last_first_name_query) do
      PersonSearchResultBuilder.new.fs_no_last_first_name_query_part_two
    end
    let(:last_first_name_query) do
      PersonSearchResultBuilder.new.fs_last_first_name_query_part_two
    end

    let(:no_name_params) {}
    let(:last_first_name_params) do
      {
        last_name: last_name,
        first_name: first_name
      }
    end

    context 'returns hash' do
      it 'with no last and first name query' do
        query_builder = QueryBuilder.new(person_search_fields: no_name_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq no_last_first_name_query['query']
      end
    end

    context 'returns hash' do
      it 'with last and first name query' do
        query_builder = QueryBuilder.new(person_search_fields: last_first_name_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq last_first_name_query['query']
      end
    end
  end
end
