# frozen_string_literal: true

module PersonSearchSsnQueryBuilderHelper
  def ssn_query
    query = {
      "bool": {
        "must": [
          { 'match' => { 'ssn' => { 'query' => '123456789' } } }
        ]
      }
    }

    build_query(query).as_json
  end
end
