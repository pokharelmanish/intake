# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByNameQueryBuilderPartOneHelper
  def full_name_functions_part_one
    full_name_without_suffix_functions_part_one.insert(1, suffix_sub_query)
  end

  def full_name_without_suffix_functions_part_one
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
                  "first_name": {
                    "query": 'first name',
                    "_name": '1_exact_first'
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
          "multi_match": {
            "query": 'last name first name',
            "operator": 'and',
            "fields": [
              'akas.first_name',
              'akas.last_name'
            ],
            "type": 'cross_fields',
            "_name": '3_multi_aka'
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
                  "first_name.diminutive": {
                    "query": 'first name',
                    "_name": '4_diminutive_first'
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
              },
              {
                "match": {
                  "first_name.phonetic": {
                    "query": 'first name',
                    "_name": '5_phonetic_first'
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
                  "last_name": {
                    "query": 'last name',
                    "_name": '6_exact_last'
                  }
                }
              },
              {
                "fuzzy": {
                  "first_name": {
                    "value": 'first name',
                    "fuzziness": '3',
                    "prefix_length": '1',
                    "max_expansions": '50',
                    "_name": '6_fuzzy_first'
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
                    "_name": '7_exact_last'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '10%',
                    "_name": '7_partial_first'
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

  def fs_no_name_query_part_one
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "last_name.keyword": 'asc',
          "first_name.keyword": 'asc',
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

  def fs_full_name_query_part_one
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "last_name.keyword": 'asc',
          "first_name.keyword": 'asc',
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
          "functions": full_name_functions_part_one,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_without_suffix_query_part_one
    {
      "size": '10',
      "track_scores": 'true',
      "sort": [
        {
          "_score": 'desc',
          "last_name.keyword": 'asc',
          "first_name.keyword": 'asc',
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
          "functions": full_name_without_suffix_functions_part_one,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
