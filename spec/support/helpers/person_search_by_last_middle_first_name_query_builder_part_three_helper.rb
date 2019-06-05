# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByLastMiddleFirstNameQueryBuilderPartThreeHelper
  def last_middle_first_name_functions_part_three
    [
      {
        "filter": {
          "bool": {
            "should": [
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'middle name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_first_by_middle'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_first_by_last'
                  }
                }
              },
              {
                "match": {
                  "middle_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_middle_by_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_middle_by_last'
                  }
                }
              },
              {
                "match": {
                  "last_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_last_by_first'
                  }
                }
              },
              {
                "match": {
                  "last_name_ngram": {
                    "query": 'middle name',
                    "minimum_should_match": '15%',
                    "_name": '15_partial_last_by_middle'
                  }
                }
              }
            ],
            "minimum_should_match": '3'
          }
        },
        "weight": 64
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '16_duplicate_last'
                  }
                }
              },
              {
                "match": {
                  "middle_name": {
                    "query": 'last name',
                    "_name": '16_duplicate_middle'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'last name',
                    "_name": '16_duplicate_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 32
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '15%',
                    "_name": '17_partial_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name_ngram": {
                    "query": 'middle name',
                    "minimum_should_match": '15%',
                    "_name": '17_partial_middle'
                  }
                }
              },
              {
                "match": {
                  "last_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '15%',
                    "_name": '17_partial_last'
                  }
                }
              }
            ]
          }
        },
        "weight": 16
      }
    ]
  end

  def fs_no_last_middle_first_query_part_three
    query = {
      "function_score": {
        "functions": [],
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_middle_first_name_query_part_three
    query = {
      "function_score": {
        "functions": last_middle_first_name_functions_part_three,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end
end
