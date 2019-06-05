# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchByLastMiddleFirstNameQueryBuilderPartThree do
  describe '.build_query' do
    let(:last_name) { 'last name' }
    let(:middle_name) { 'middle name' }
    let(:first_name) { 'first name' }

    let(:no_name_query) { PersonSearchResultBuilder.new.fs_no_last_middle_first_query_part_three }
    let(:last_middle_first_name_query) do
      PersonSearchResultBuilder.new.fs_last_middle_first_name_query_part_three
    end

    let(:no_name_params) {}
    let(:last_middle_first_name_params) do
      {
        last_name: last_name,
        middle_name: middle_name,
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
      it 'with last, middle, and first name query' do
        query_builder = QueryBuilder.new(person_search_fields: last_middle_first_name_params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq last_middle_first_name_query['query']
      end
    end
  end
end
