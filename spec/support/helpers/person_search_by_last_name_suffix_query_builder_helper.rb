# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByLastNameSuffixQueryBuilderHelper
  def last_name_suffix_functions
    [
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '1_exact_last'
                  }
                }
              },
              {
                "match": {
                  "name_suffix": {
                    "query": 'suffix',
                    "_name": '1_exact_suffix'
                  }
                }
              }
            ]
          }
        },
        "weight": 16_384
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "akas.last_name": {
                    "query": 'last name',
                    "_name": '2_aka_last'
                  }
                }
              },
              {
                "match": {
                  "akas.suffix": {
                    "query": 'suffix',
                    "_name": '2_aka_suffix'
                  }
                }
              }
            ]
          }
        },
        "weight": 8192
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '3_exact_last'
                  }
                }
              },
              {
                "match": {
                  "name_suffix_ngram": {
                    "query": 'suffix',
                    "minimum_should_match": '15%',
                    "_name": '3_partial_suffix'
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
                    "_name": '4_exact_last'
                  }
                }
              },
              {
                "match": {
                  "name_suffix.diminutive": {
                    "query": 'suffix',
                    "_name": '4_diminutive_suffix'
                  }
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
                    "_name": '5_exact_last'
                  }
                }
              }
            ],
            "must_not": [
              {
                "match": {
                  "name_suffix": {
                    "query": 'suffix',
                    "_name": '5_no_match_suffix'
                  }
                }
              }
            ]
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
                  "name_suffix": {
                    "query": 'suffix',
                    "_name": '6_exact_suffix'
                  }
                }
              },
              {
                "match": {
                  "last_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '15%',
                    "_name": '6_partial_last'
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
                  "name_suffix": {
                    "query": 'suffix',
                    "_name": '7_exact_suffix'
                  }
                }
              },
              {
                "fuzzy": {
                  "last_name": {
                    "value": 'last name',
                    "fuzziness": 'AUTO',
                    "prefix_length": '1',
                    "max_expansions": '50',
                    "_name": '7_fuzzy_last'
                  }
                }
              }
            ]
          }
        },
        "weight": 256
      }
    ]
  end

  def fs_no_last_name_suffix_query
    query = {
      "function_score": {
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "legacy_descriptor.legacy_table_name": {
                    "query": 'CLIENT_T',
                    "_name": 'q_cli'
                  }
                }
              }
            ]
          }
        },
        "functions": [],
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_name_suffix_query
    query = {
      "function_score": {
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "legacy_descriptor.legacy_table_name": {
                    "query": 'CLIENT_T',
                    "_name": 'q_cli'
                  }
                }
              }
            ]
          }
        },
        "functions": last_name_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end
end
