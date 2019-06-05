# frozen_string_literal: true

# PersonSearchBySexOfBirthQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchBySexAtBirthQueryBuilder
  attr_reader :gender

  include QueryBuilderHelper

  def build_query(builder)
    builder.payload[:query][:function_score][:query][:bool][:must].concat(must)
  end

  def query
    { bool: { must: must } }
  end

  def must
    [query_string('gender', formatted_query(gender), boost: NO_BOOST)].flatten.compact
  end
end
