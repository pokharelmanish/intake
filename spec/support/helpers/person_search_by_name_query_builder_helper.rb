# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByNameQueryBuilderHelper
  def suffix_sub_query
    {
      "filter": {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": 'last name suffix',
                "operator": 'and',
                "fields": %w[
                  last_name
                  suffix
                ],
                "type": 'cross_fields',
                "_name": '2_mlt_last_suffix'
              }
            }
          ]
        }
      },
      "weight": 8192
    }
  end

  def full_name_functions
    full_name_without_suffix_functions.insert(1, suffix_sub_query)
  end

  def full_name_without_suffix_functions
    [
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'last name',
                    "_name": '1_m_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'first name',
                    "_name": '1_m_fst'
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
          "multi_match": {
            "query": 'last name first name',
            "operator": 'and',
            "fields": [
              'akas.first_name',
              'akas.last_name'
            ],
            "type": 'cross_fields',
            "_name": '3_mlt_aka'
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
                    "_name": '4_dim_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name.diminutive": {
                    "query": 'first name',
                    "_name": '4_dim_fst'
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
                    "_name": '5_pho_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name.phonetic": {
                    "query": 'first name',
                    "_name": '5_pho_fst'
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
                    "_name": '6_fz_lst'
                  }
                }
              },
              {
                "fuzzy": {
                  "first_name": {
                    "value": 'first name',
                    "fuzziness": '5',
                    "prefix_length": '1',
                    "max_expansions": '25',
                    "_name": '6_fz_fst'
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
                    "_name": '7_prt_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '25%',
                    "_name": '7_prt_fst'
                  }
                }
              }
            ]
          }
        },
        "weight": 256
      },
      {
        "filter": {
          "multi_match": {
            "query": 'last name first name',
            "operator": 'and',
            "fields": %w[
              first_name
              last_name
            ],
            "fuzziness": '2',
            "_name": '7_mlt_fz'
          }
        },
        "weight": 200
      },
      {
        "filter": {
          "bool": {
            "must": [
              {
                "match": {
                  "last_name": {
                    "query": 'first name',
                    "_name": '9a_rev_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'last name',
                    "_name": '9a_rev_fst'
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
                    "_name": '9b_rev_prt_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '25%',
                    "_name": '9b_rev_prt_fst'
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
                    "_name": '10_dup_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name": {
                    "query": 'last name',
                    "_name": '10_dup_fst'
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
                  "last_name_ngram": {
                    "query": 'first name',
                    "minimum_should_match": '25%',
                    "_name": '11_rev_prt_lst'
                  }
                }
              },
              {
                "match": {
                  "first_name_ngram": {
                    "query": 'last name',
                    "minimum_should_match": '25%',
                    "_name": '11_rev_prt_fst'
                  }
                }
              }
            ]
          }
        },
        "weight": 16
      },
      {
        "filter": {
          "match": {
            "last_name": {
              "query": 'last name',
              "_name": '8_m_lst'
            }
          }
        },
        "weight": 12
      },
      {
        "filter": {
          "match": {
            "first_name": {
              "query": 'first name',
              "_name": 'xb_m_fst'
            }
          }
        },
        "weight": 8
      }
    ]
  end

  def fs_no_name_query
    {
      "size": '250',
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
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_last_name_approx_age_years_gender_query
    {
      "size": '250',
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
      "size": '250',
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
      "size": '250',
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
          "functions": full_name_functions,
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_without_suffix_query
    {
      "size": '250',
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
          "functions": full_name_without_suffix_functions,
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_dob_query
    {
      "size": '250',
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
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_approx_age_months_gender_query
    {
      "size": '250',
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
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_approx_age_years_gender_query
    {
      "size": '250',
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
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def fs_full_name_without_suffix_approx_age_months_gender_query
    {
      "size": '250',
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
          "score_mode": 'sum',
          "boost_mode": 'sum'
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
