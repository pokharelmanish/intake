# frozen_string_literal: true

# PeopleSearchQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonAdvancedSearchQueryBuilder
  attr_reader :is_client_only, :is_advanced_search, :search_term,
    :last_name, :first_name, :middle_name, :client_id, :suffix, :ssn,
    :date_of_birth, :approximate_age, :approximate_age_units, :sex_at_birth,
    :street, :city, :county, :state, :country, :zip_code

  include QueryBuilderHelper

  def build_query(builder)
    builder.payload[:query] = query
  end

  def query
    { bool: { must: must, should: should } }
  end

  def must
    # the client_only_search config option overrides the @is_client_only value
    return [] unless Rails.configuration.intake[:client_only_search] ||
                     is_client_only

    [client_only]
  end

  def should
    [
      query_string('last_name', formatted_query(last_name), boost: MEDIUM_BOOST),
      query_string('first_name', formatted_query(first_name), boost: MEDIUM_BOOST),
      query_string('middle_name', formatted_query(middle_name), boost: MEDIUM_BOOST),
      query_string('last_name.phonetic', formatted_query(last_name), boost: LOW_BOOST),
      query_string('first_name.phonetic', formatted_query(first_name), boost: LOW_BOOST),
      query_string('middle_name.phonetic', formatted_query(middle_name), boost: LOW_BOOST),
      query_string('last_name.diminutive', formatted_query(last_name), boost: LOW_BOOST),
      query_string('first_name.diminutive', formatted_query(first_name), boost: LOW_BOOST),
      query_string('middle_name.diminutive', formatted_query(middle_name), boost: LOW_BOOST),
      query_string('name_suffix', formatted_query(suffix), boost: MEDIUM_BOOST),
      query_string('ssn', formatted_query(ssn), boost: HIGH_BOOST),
      query_string('date_of_birth_as_text', formatted_date_of_birth(date_of_birth), boost: HIGH_BOOST)
    ].flatten.compact
  end

  def client_only
    { match: { 'legacy_descriptor.legacy_table_name' => 'CLIENT_T' } }
  end
end
