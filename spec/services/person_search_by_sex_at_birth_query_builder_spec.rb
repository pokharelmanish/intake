# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchBySexAtBirthQueryBuilder do
  let(:gender) { 'male' }
  let(:gender_query) { PersonSearchResultBuilder.new.gender_query }
  let(:params) do
    { gender: gender }
  end

  describe '.query' do
    context 'returns hash' do
      it 'with query' do
        query_builder = QueryBuilder.new(person_search_fields: params)
        query = query_builder.extend(described_class).query
        expect(query.as_json).to eq gender_query['query']
      end
    end
  end
end
