# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByLastMiddleFirstNameQueryBuilderPartOneHelper
  def last_middle_first_name_with_suffix_functions_part_one
    last_middle_first_name_functions_part_one.insert(1,
      last_middle_first_name_with_suffix_sub_query)
  end

  def last_middle_first_name_functions_part_one
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
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '1_exact_middle'
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
        "weight": 524_288
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "akas.last_name": {
                    "query": 'last name',
                    "_name": '3_aka_last'
                  }
                }
              },
              {
                "match": {
                  "akas.middle_name": {
                    "query": 'middle name',
                    "_name": '3_aka_middle'
                  }
                }
              },
              {
                "match": {
                  "akas.first_name": {
                    "query": 'first name',
                    "_name": '3_aka_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 262_144
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
                  "first_name": {
                    "query": 'first name',
                    "_name": '4_exact_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name.diminutive": {
                    "query": 'middle name',
                    "_name": '4_diminutive_middle'
                  }
                }
              }
            ]
          }
        },
        "weight": 131_072
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
                  "first_name": {
                    "query": 'first name',
                    "_name": '5_exact_first'
                  }
                }
              }
            ],
            "must_not": [
              {
                "match": {
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '5_no_match_middle'
                  }
                }
              }
            ]
          }
        },
        "weight": 65_536
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
                "match": {
                  "first_name": {
                    "query": 'middle name',
                    "_name": '6_dupe_first'
                  }
                }
              },
              {
                "match": {
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '6_dupe_middle'
                  }
                }
              }
            ]
          }
        },
        "weight": 32_768
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
                  "middle_name": {
                    "query": 'middle name',
                    "_name": '7_exact_middle'
                  }
                }
              },
              {
                "match": {
                  "first_name.diminutive": {
                    "query": 'first name',
                    "_name": '7_diminutive_first'
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
                  "last_name": {
                    "query": 'last name',
                    "_name": '8_exact_last'
                  }
                }
              },
              {
                "match": {
                  "middle_name.diminutive": {
                    "query": 'middle name',
                    "_name": '8_diminutive_middle'
                  }
                }
              },
              {
                "match": {
                  "first_name.diminutive": {
                    "query": 'first name',
                    "_name": '8_diminutive_first'
                  }
                }
              }
            ]
          }
        },
        "weight": 8192
      }
    ]
  end

  def fs_no_last_middle_first_query_part_one
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

  def fs_last_middle_first_name_with_suffix_query_part_one
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
        "functions": last_middle_first_name_with_suffix_functions_part_one,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end

  def fs_last_middle_first_name_query_part_one
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
        "functions": last_middle_first_name_functions_part_one,
        "score_mode": 'max',
        "boost_mode": 'max'
      }
    }

    build_query(query).as_json
  end
end
