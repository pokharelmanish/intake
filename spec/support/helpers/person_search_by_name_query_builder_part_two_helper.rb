# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByNameQueryBuilderPartTwoHelper
  def full_name_functions_part_two
    [
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '8_exact_last'
                  }
                }
              }
            ],
            "must_not": [
              {
                "match": {
                  "first_name": {
                    "query": 'first name',
                    "_name": '8_no_match_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 128
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'first name',
                    "_name": '9a_reverse_exact_last'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'last name',
                    "_name": '9a_reverse_exact_first'
                  }
                }
              }
            ]
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
                    "query": 'first name',
                    "_name": '9b_reverse_partial_last'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '25%',
                    "_name": '9b_reverse_partial_first'
                  }
                }
              }
            ]
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
                    "_name": '10_dupe_exact_last'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'last name',
                    "_name": '10_dupe_exact_first'
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
                    "minimum_should_match": '10%',
                    "_name": '11_partial_first'
                  }
                }
              },
              {
                "match": {
                  "last_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '15%',
                    "_name": '11_partial_last'
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

  def fs_no_name_query_part_two
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
          "functions": [],
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_query_part_two
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
          "functions": full_name_functions_part_two,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
