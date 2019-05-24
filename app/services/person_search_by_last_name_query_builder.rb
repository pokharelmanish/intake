# frozen_string_literal: true

# PersonSearchByLastNameQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByLastNameQueryBuilder
  attr_reader :is_client_only, :last_name

  include QueryBuilderHelper

  def build_query(builder)
    builder.payload[:query] = query
  end

  def query
    q = { bool: { must: must } }
    f = last_name.blank? ? [] : function_score_queries(fs_query_params)
    { function_score: { query: q, functions: f, score_mode: 'max', boost_mode: 'max' } }
  end

  def must
    # the client_only_search config option overrides the @is_client_only value
    return [] unless Rails.configuration.intake[:client_only_search] || is_client_only
    [client_only]
  end

  def client_only
    match_query(field: 'legacy_descriptor.legacy_table_name', query: 'CLIENT_T', name: 'q_cli')
  end

  def match_last_name
    [match_query(field: 'last_name', query: last_name, name: '1_exact')]
  end

  def match_last_name_akas
    [match_query(field: 'akas.last_name', query: last_name, name: '2_aka')]
  end

  def match_last_name_phon
    [match_query(field: 'last_name.phonetic', query: last_name, name: '3_phonetic')]
  end

  def match_last_name_partial
    [match_query(field: 'last_name_ngram', query: last_name, min_s_m: '10%',
                 name: '4_partial')]
  end

  def match_last_name_fuzzy
    [fuzzy_query(field: 'last_name', value: last_name, fuzziness: 'AUTO', prefix_length: '1',
                 max_expansions: '150', name: '5_fuzzy')]
  end

  def fs_query_params
    [
      { q: match_last_name, w: 16_384, bq: true },
      { q: match_last_name_akas, w: 8192, bq: true },
      { q: match_last_name_phon, w: 1024, bq: true },
      { q: match_last_name_partial, w: 2048, bq: true },
      { q: match_last_name_fuzzy, w: 4096, bq: true }
    ].compact
  end
end
