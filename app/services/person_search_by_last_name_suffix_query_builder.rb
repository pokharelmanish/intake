# frozen_string_literal: true

# PersonSearchByLastNameSuffixQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByLastNameSuffixQueryBuilder
  attr_reader :is_client_only, :last_name, :suffix

  include QueryBuilderHelper

  def build_query(builder)
    builder.payload[:query] = query
  end

  def query
    q = { bool: { must: must } }
    f = function_score_queries(fs_query_params)
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

  def match_last_name_and_suffix
    last_name_params = generate_match_params('last_name', last_name, '1_exact_last', nil)
    suffix_params = generate_match_params('name_suffix', suffix, '1_exact_suffix', nil)
    param_list = [last_name_params, suffix_params]
    match_query_list(param_list)
  end

  def match_last_name_and_suffix_akas
    last_name_aka_params = generate_match_params('akas.last_name', last_name, '2_aka_last', nil)
    suffix_aka_params = generate_match_params('akas.suffix', suffix, '2_aka_suffix', nil)
    param_list = [last_name_aka_params, suffix_aka_params]
    match_query_list(param_list)
  end

  def match_last_name_suffix_partial
    last_name_params = generate_match_params('last_name', last_name, '3_exact_last', nil)
    partial_suffix_params = generate_match_params('name_suffix_ngram', suffix, '3_partial_suffix',
      '15%')
    param_list = [last_name_params, partial_suffix_params]
    match_query_list(param_list)
  end

  def match_last_name_suffix_dim
    last_name_params = generate_match_params('last_name', last_name, '4_exact_last', nil)
    dim_suffix_params = generate_match_params('name_suffix.diminutive', suffix,
      '4_diminutive_suffix', nil)
    param_list = [last_name_params, dim_suffix_params]
    match_query_list(param_list)
  end

  def match_last_name
    [match_query(field: 'last_name', query: last_name, name: '5_exact_last')].compact
  end

  def match_suffix
    [match_query(field: 'name_suffix', query: suffix, name: '5_no_match_suffix')].compact
  end

  def match_suffix_last_name_partial
    suffix_params = generate_match_params('name_suffix', suffix, '6_exact_suffix', nil)
    partial_last_name_params = generate_match_params('last_name_ngram', last_name, '6_partial_last',
      '15%')
    param_list = [suffix_params, partial_last_name_params]
    match_query_list(param_list)
  end

  def match_suffix_last_name_fuzzy
    suffix_query = match_query(generate_match_params('name_suffix', suffix, '7_exact_suffix', nil))
    fuzzy_last_name_query = fuzzy_query(field: 'last_name', value: last_name, fuzziness: 'AUTO',
                                        prefix_length: '1', max_expansions: '50',
                                        name: '7_fuzzy_last')
    [suffix_query, fuzzy_last_name_query].compact
  end

  def fs_query_params
    [
      { q: match_last_name_and_suffix, w: 16_384, bq: true },
      { q: match_last_name_and_suffix_akas, w: 8192, bq: true },
      { q: match_last_name_suffix_partial, w: 4096, bq: true },
      { q: match_last_name_suffix_dim, w: 2048, bq: true },
      { q: match_last_name, not_q: match_suffix, w: 1024, bq: true },
      { q: match_suffix_last_name_partial, w: 512, bq: true },
      { q: match_suffix_last_name_fuzzy, w: 256, bq: true }
    ].compact
  end
end
