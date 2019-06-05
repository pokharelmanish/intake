# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchByApproximateAgeQueryBuilderHelper
  def approx_age_query_blank
    query = {
      "bool": {
        "must": []
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_months_zero
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 6.months).iso8601,
                "lte": Date.current.iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_months_seven
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 7.months - 6.months).iso8601,
                "lte": (Date.current - 7.months + 6.months).iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_months_twenty_four
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 24.months - 6.months).iso8601,
                "lte": (Date.current - 24.months + 6.months).iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_years_zero
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 2.years).iso8601,
                "lte": Date.current.iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_years_twelve
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 12.years - 2.years).iso8601,
                "lte": (Date.current - 12.years + 2.years).iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_years_thirteen
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 13.years - 5.years).iso8601,
                "lte": (Date.current - 13.years + 5.years).iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end

  def approx_age_query_years_one_hundred_twenty
    query = {
      "bool": {
        "must": [
          {
            "range": {
              "date_of_birth": {
                "gte": (Date.current - 120.years - 5.years).iso8601,
                "lte": (Date.current - 120.years + 5.years).iso8601,
                "format": 'yyyy-MM-dd'
              }
            }
          }
        ]
      }
    }

    build_query(query).as_json
  end
end
