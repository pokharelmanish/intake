# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class PeopleController < ApiController # :nodoc:
      respond_to :json

      def search
        search_response = PersonSearchRepository.search(
          session[:security_token],
          params[:search_term]
        )
        render json: search_response
      end
    end
  end
end
