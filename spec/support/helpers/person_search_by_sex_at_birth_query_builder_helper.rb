# frozen_string_literal: true

module PersonSearchBySexAtBirthQueryBuilderHelper
  def gender_query
    query = {
      "bool": {
        "must": [
          {
            "query_string": {
              "default_field": 'gender',
              "query": 'male',
              "boost": '1'
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end
end
