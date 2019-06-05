# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByLastMiddleFirstNameQueryBuilderPartTwoHelper
  def last_middle_first_name_functions_part_two
    [
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '9_exact_last'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'middle name',
                    "_name": '9_dupe_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '9_dupe_middle'
                  }
                }
              }
            ]
          }
        },
        "weight": 4096
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '10_exact_last'
                  }
                }
              },
              {
                "multi_match": {
                  "query": 'first name middle name',
                  "type": 'cross_fields',
                  "operator": 'or',
                  "_name": '10_phonetic_first_or_middle',
                  "fields": ['first_name.phonetic', 'middle_name.phonetic']
                }
              }
            ]
          }
        },
        "weight": 2048
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '11_exact_last'
                  }
                }
              }
            ],
            "should": [
              {
                "fuzzy": {
                  "first_name": {
                    "value": 'first name',
                    "fuzziness": 'AUTO',
                    "prefix_length": '1',
                    "max_expansions": '50',
                    "_name": '11_fuzzy_first'
                  }
                }
              },
              {
                "fuzzy": {
                  "middle_name": {
                    "value": 'middle name',
                    "fuzziness": 'AUTO',
                    "prefix_length": '1',
                    "max_expansions": '50',
                    "_name": '11_fuzzy_middle'
                  }
                }
              }
            ],
            "minimum_should_match": '1'
          }
        },
        "weight": 1024
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '12_exact_last'
                  }
                }
              },
              {
                "match": {
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '12_exact_middle'
                  }
                }
              }
            ],
            "must_not": [
              {
                "match": {
                  "first_name": {
                    "query": 'first name',
                    "_name": '12_no_exact_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 512
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '13_exact_last'
                  }
                }
              }
            ],
            "should": [
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '15%',
                    "_name": '13_partial_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name_ngram": {
                    "query": 'middle name',
                    "minimum_should_match": '15%',
                    "_name": '13_partial_middle'
                  }
                }
              }
            ],
            "minimum_should_match": '1'
          }
        },
        "weight": 256
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '14_exact_last'
                  }
                }
              }
            ],
            "must_not": [
              {
                "match": {
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '14_no_exact_middle'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'first name',
                    "_name": '14_no_exact_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 128
      }
    ]
  end

  def fs_no_last_middle_first_query_part_two
    query = {
      "function_score": {
        "functions": [],
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_middle_first_name_query_part_two
    query = {
      "function_score": {
        "functions": last_middle_first_name_functions_part_two,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end
end
