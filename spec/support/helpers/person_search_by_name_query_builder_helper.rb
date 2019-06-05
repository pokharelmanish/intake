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

  def last_middle_first_name_with_suffix_sub_query
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
                "middle_name": {
                  "query": 'middle name',
                  "_name": '2_exact_middle'
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
      "weight": 1_048_576
    }
  end

  def last_first_name_with_suffix_functions
    last_first_name_functions.insert(1, suffix_sub_query)
  end

  def last_first_name_functions
    last_first_name_functions_part_one.concat(last_first_name_functions_part_two)
  end

  def last_middle_first_name_with_suffix_functions
    last_middle_first_name_functions.insert(1, last_middle_first_name_with_suffix_sub_query)
  end

  def last_middle_first_name_functions
    last_middle_first_name_functions_part_one
      .concat(last_middle_first_name_functions_part_two)
      .concat(last_middle_first_name_functions_part_three)
  end

  def fs_no_name_query
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

  def fs_last_name_approx_age_years_gender_query
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
    }

    build_query(query).as_json
  end

  def fs_last_name_suffix_approx_age_years_gender_query
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
    }

    build_query(query).as_json
  end

  def fs_last_and_first_name_with_suffix_query
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
        "functions": last_first_name_with_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_and_first_name_query
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
        "functions": last_first_name_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_first_name_with_suffix_dob_query
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
        "functions": last_first_name_with_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_first_name_with_suffix_approx_age_months_gender_query
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
        "functions": last_first_name_with_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_first_name_with_suffix_approx_age_years_gender_query
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
        "functions": last_first_name_with_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_first_name_approx_age_months_gender_query
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
        "functions": last_first_name_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_middle_first_name_with_suffix_approx_age_years_gender_query
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
        "functions": last_middle_first_name_with_suffix_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_middle_first_name_approx_age_months_gender_query
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
        "functions": last_middle_first_name_functions,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end
end
