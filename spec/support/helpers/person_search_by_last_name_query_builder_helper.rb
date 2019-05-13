# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByLastNameQueryBuilderHelper
  def last_name_functions
    [
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '1_exact'
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
                    "_name": '2_aka'
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
                  "last_name.phonetic": {
                    "query": 'last name',
                    "_name": '3_phonetic'
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
                  "last_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '20%',
                    "_name": '4_partial'
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
                "fuzzy": {
                  "last_name": {
                    "value": 'last name',
                    "fuzziness": '5',
                    "prefix_length": '1',
                    "max_expansions": '50',
                    "_name": '5_fuzzy'
                  }
                }
              }
            ]
          }
        },
        "weight": 4096
      }
    ]
  end

  def fs_no_last_name_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "last_name": 'asc',
          "first_name": 'asc',
          "_uid": 'desc'
        }
      ],
      "min_score": '2.5',
      "query": {
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
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_last_name_query
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "last_name": 'asc',
          "first_name": 'asc',
          "_uid": 'desc'
        }
      ],
      "min_score": '2.5',
      "query": {
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
          "functions": last_name_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
