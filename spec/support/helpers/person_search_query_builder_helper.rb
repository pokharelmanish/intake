# frozen_string_literal: true

# rubocop:disable Metrics/ModuleLength
module PersonSearchQueryBuilderHelper
  def person_only_query
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
        "bool": {
          "must": [
            {
              "match": {
                "legacy_descriptor.legacy_table_name": 'CLIENT_T'
              }
            }
          ],
          "should": [
            {
              "match": {
                "legacy_descriptor.legacy_ui_id_flat": {
                  "boost": '14',
                  "query": 'this is test search term'
                }
              }
            },
            {
              "query_string": {
                "default_field": 'autocomplete_search_bar',
                "query": 'this is test search term',
                "boost": '14'
              }
            },
            {
              "query_string": {
                "default_field": 'first_name',
                "query": 'this is test search term',
                "boost": '4'
              }
            },
            {
              "query_string": {
                "default_field": 'last_name',
                "query": 'this is test search term',
                "boost": '4'
              }
            },
            {
              "query_string": {
                "default_field": 'first_name.phonetic',
                "query": 'this is test search term',
                "boost": '2'
              }
            },
            {
              "query_string": {
                "default_field": 'last_name.phonetic',
                "query": 'this is test search term',
                "boost": '2'
              }
            },
            {
              "query_string": {
                "default_field": 'first_name.diminutive',
                "query": 'this is test search term',
                "boost": '2'
              }
            },
            {
              "query_string": {
                "default_field": 'last_name.diminutive',
                "query": 'this is test search term',
                "boost": '2'
              }
            },
            {
              "query_string": {
                "default_field": 'date_of_birth_as_text',
                "query": 'this is test search term',
                "boost": '14'
              }
            },
            {
              "query_string": {
                "default_field": 'ssn',
                "query": 'this is test search term',
                "boost": '14'
              }
            },
            {
              "query_string": {
                "default_field": 'name_suffix',
                "query": 'this is test search term',
                "boost": '4'
              }
            }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end

  def client_id_only_query
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
        "bool": {
          "must": [{
            "match": {
              "legacy_descriptor.legacy_ui_id_flat": {
                "query": '1111111111111111111',
                "boost": '14'
              }
            }
          }]
        }
      },
      "_source": source
    }.as_json
  end

  def ssn_only_query
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
        "bool": {
          "must": [
            { 'match' => { 'ssn' => { 'query' => '123456789' } } }
          ]
        }
      },
      "_source": source,
      "highlight": highlight
    }.as_json
  end
end
