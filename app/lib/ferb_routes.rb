# frozen_string_literal: true

# The external Ferb routes will be accessible from here.
class FerbRoutes
  class << self
    def investigation_path(id)
      "/investigations/#{id}"
    end

    def investigations_contacts_path(id)
      "/investigations/#{id}/contacts"
    end

    def investigations_contact_path(investigation_id, contact_id)
      "/investigations/#{investigation_id}/contacts/#{contact_id}"
    end

    def screening_history_of_involvements_path(id)
      "/screenings/#{id}/history_of_involvements"
    end

    def lov_path
      '/lov'
    end

    def cross_report_agency
      '/cross_report_agency'
    end

    def staff_path(id)
      "/staffpersons/#{id}"
    end

    def client_authorization_path(id)
      "/authorize/client/#{id}"
    end

    def relationships_path
      '/clients/relationships'
    end

    def history_of_involvements_path
      '/clients/history_of_involvements'
    end
  end
end