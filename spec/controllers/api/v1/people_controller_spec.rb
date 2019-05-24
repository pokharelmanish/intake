# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:token) { 'token' }
  let(:session) do
    { token: token }
  end
  let(:people) { double(:search_response, as_json: 'search response') }
  let(:params) do
    { person_search_fields: { search_term: 'foobarbaz', street: '123 main street' } }
  end
  let(:request_payload) { PersonSearchResultBuilder.new.person_only_query }

  describe '#index' do
    context 'when search_after is not provied as a param' do
      before do
        allow(PersonSearchRepository).to receive(:search).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        get :index, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end

    context 'when search_after is provied as a param' do
      before(:each) do
        params[:search_after] = ['hello world']
        allow(PersonSearchRepository).to receive(:search).and_return(people)
      end

      it 'searches for people and renders a json with person attributes' do
        get :index, params: params, session: session
        expect(response).to be_successful
        expect(response.body).to eq('"search response"')
      end
    end

    context 'when search_term is present' do
      before(:each) do
        stub_request(:post,
          dora_api_url(ExternalRoutes.dora_people_light_index_path))
          .with(body: JSON.parse(request_payload.to_json))
          .and_return({}, status: 200)
      end

      it 'returns response with the searched term' do
        get :index, params: {
          person_search_fields: { search_term: 'this is test search term' },
          size: 25
        },
                    session: session
        expect(response).to be_successful
      end
    end
  end

  describe '#show' do
    let(:id) { '1' }
    before(:each) do
      person = instance_double('ActionDispatch::Response',
        body: 'search response')
      allow(PersonSearchRepository).to receive(:find)
        .with(id, anything, token: token)
        .and_return(person)
      stub_request(:get, ferb_api_url(FerbRoutes.client_authorization_path(id)))
        .and_return(json_body('', status: 200))
    end

    it 'searches for a person and renders a json with person attributes' do
      get :show, params: { id: id }, session: session
      expect(response).to be_successful
      expect(response.body).to eq('"search response"')
    end
  end
end
