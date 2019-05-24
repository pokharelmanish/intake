# frozen_string_literal: true

# PersonSearchByNameQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByNameQueryBuilderPartOne
  attr_reader :is_client_only, :last_name, :first_name, :middle_name, :suffix

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

  def match_last_and_first_name
    last_name_params = generate_match_params('last_name', last_name, '1_exact_last', nil)
    first_name_params = generate_match_params('first_name', first_name, '1_exact_first', nil)
    param_list = [last_name_params, first_name_params]
    match_query_list(param_list)
  end

  def match_last_and_first_name_with_suffix
    return if suffix.blank?
    last_name_params = generate_match_params('last_name', last_name, '2_exact_last', nil)
    first_name_params = generate_match_params('first_name', first_name, '2_exact_first', nil)
    suffix_params = generate_match_params('name_suffix', suffix, '2_exact_suffix', nil)
    param_list = [last_name_params, first_name_params, suffix_params]
    match_query_list(param_list)
  end

  def multi_match_last_and_first_name_akas
    params = {
      query: formatted_query("#{last_name} #{first_name}"),
      operator: 'and',
      fields: %w[akas.first_name akas.last_name],
      type: 'cross_fields',
      name: '3_multi_aka'
    }
    multi_match(params)
  end

  def match_last_name_first_name_dim
    last_name_params = generate_match_params('last_name', last_name, '4_exact_last', nil)
    dim_first_name_params = generate_match_params('first_name.diminutive', first_name,
      '4_diminutive_first', nil)
    param_list = [last_name_params, dim_first_name_params]
    match_query_list(param_list)
  end

  def match_last_name_first_name_phon
    last_name_params = generate_match_params('last_name', last_name, '5_exact_last', nil)
    phon_first_name_params = generate_match_params('first_name.phonetic', first_name,
      '5_phonetic_first', nil)
    param_list = [last_name_params, phon_first_name_params]
    match_query_list(param_list)
  end

  def match_last_name_first_name_fuzzy
    last_name_query = match_query(generate_match_params('last_name', last_name, '6_exact_last',
      nil))
    fuzzy_query_params = { field: 'first_name', value: first_name, fuzziness: '3',
                           prefix_length: '1', max_expansions: '50', name: '6_fuzzy_first' }
    fuzzy_first_name_query = fuzzy_query(fuzzy_query_params)
    [last_name_query, fuzzy_first_name_query].compact
  end

  def match_last_name_first_name_partial
    last_name_params = generate_match_params('last_name', last_name, '7_exact_last', nil)
    partial_first_name_params = generate_match_params('first_name_ngram', first_name,
      '7_partial_first', '10%')
    param_list = [last_name_params, partial_first_name_params]
    match_query_list(param_list)
  end

  def fs_query_params
    [
      { q: match_last_and_first_name, w: 8192, bq: true },
      { q: match_last_and_first_name_with_suffix, w: 16_384, bq: true },
      { q: multi_match_last_and_first_name_akas, w: 4096, bq: false },
      { q: match_last_name_first_name_dim, w: 2048, bq: true },
      { q: match_last_name_first_name_phon, w: 1024, bq: true },
      { q: match_last_name_first_name_fuzzy, w: 512, bq: true },
      { q: match_last_name_first_name_partial, w: 256, bq: true }
    ].compact
  end
end
