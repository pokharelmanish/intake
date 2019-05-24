# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByNameQueryBuilderHelper
  def suffix_sub_query
    {
      "filter": {
        "bool": {
          "must": [
            {
              "match": {
                "last_name": {
                  "query": 'last name',
                  "_name": '2_exact_last'
                }
              }
            },
            {
              "match": {
                "first_name": {
                  "query": 'first name',
                  "_name": '2_exact_first'
                }
              }
            },
            {
              "match": {
                "name_suffix": {
                  "query": 'suffix',
                  "_name": '2_exact_suffix'
                }
              }
            }
          ]
        }
      },
      "weight": 16_384
    }
  end

  def full_name_functions
    full_name_without_suffix_functions.insert(1, suffix_sub_query)
  end

  def full_name_without_suffix_functions
    full_name_without_suffix_functions_part_one.concat(full_name_functions_part_two)
  end

  def fs_no_name_query
    {
      "size": '25',
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

  def fs_last_name_approx_age_years_gender_query
    {
      "size": '25',
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
                },
                {
                  "range": {
                    "date_of_birth": {
                      "gte": (Date.current - 100.years - 5.years).iso8601,
                      "lte": (Date.current - 100.years + 5.years).iso8601,
                      "format": 'yyyy-MM-dd'
                    }
                  }
                },
                {
                  "query_string": {
                    "default_field": 'gender',
                    "query": 'male',
                    "boost": '1'
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

  def fs_last_name_suffix_approx_age_years_gender_query
    {
      "size": '25',
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
                },
                {
                  "range": {
                    "date_of_birth": {
                      "gte": (Date.current - 100.years - 5.years).iso8601,
                      "lte": (Date.current - 100.years + 5.years).iso8601,
                      "format": 'yyyy-MM-dd'
                    }
                  }
                },
                {
                  "query_string": {
                    "default_field": 'gender',
                    "query": 'male',
                    "boost": '1'
                  }
                }
              ]
            }
          },
          "functions": last_name_suffix_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_query
    {
      "size": '25',
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
          "functions": full_name_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_without_suffix_query
    {
      "size": '25',
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
          "functions": full_name_without_suffix_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_dob_query
    {
      "size": '25',
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
                },
                {
                  "query_string": {
                    "default_field": 'date_of_birth_as_text',
                    "query": '05051989',
                    "boost": '14'
                  }
                }
              ]
            }
          },
          "functions": full_name_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_approx_age_months_gender_query
    {
      "size": '25',
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
                },
                {
                  "range": {
                    "date_of_birth": {
                      "gte": (Date.current - 12.months - 6.months).iso8601,
                      "lte": (Date.current - 12.months + 6.months).iso8601,
                      "format": 'yyyy-MM-dd'
                    }
                  }
                },
                {
                  "query_string": {
                    "default_field": 'gender',
                    "query": 'female',
                    "boost": '1'
                  }
                }
              ]
            }
          },
          "functions": full_name_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_approx_age_years_gender_query
    {
      "size": '25',
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
                },
                {
                  "range": {
                    "date_of_birth": {
                      "gte": (Date.current - 100.years - 5.years).iso8601,
                      "lte": (Date.current - 100.years + 5.years).iso8601,
                      "format": 'yyyy-MM-dd'
                    }
                  }
                },
                {
                  "query_string": {
                    "default_field": 'gender',
                    "query": 'male',
                    "boost": '1'
                  }
                }
              ]
            }
          },
          "functions": full_name_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_without_suffix_approx_age_months_gender_query
    {
      "size": '25',
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
                },
                {
                  "range": {
                    "date_of_birth": {
                      "gte": (Date.current - 12.months - 6.months).iso8601,
                      "lte": (Date.current - 12.months + 6.months).iso8601,
                      "format": 'yyyy-MM-dd'
                    }
                  }
                },
                {
                  "query_string": {
                    "default_field": 'gender',
                    "query": 'female',
                    "boost": '1'
                  }
                }
              ]
            }
          },
          "functions": full_name_without_suffix_functions,
          "score_mode": 'max',
          "boost_mode": 'max'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
