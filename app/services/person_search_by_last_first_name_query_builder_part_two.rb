# frozen_string_literal: true

# PersonSearchByLastFirstNameQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByLastFirstNameQueryBuilderPartTwo
  attr_reader :is_client_only, :last_name, :first_name, :middle_name

  include QueryBuilderHelper

  def build_query(builder)
    queries = function_score_queries(fs_query_params)
    builder.payload[:query][:function_score][:functions].concat(queries)
  end

  def query
    f = function_score_queries(fs_query_params)
    { function_score: { functions: f, score_mode: 'max', boost_mode: 'max' } }
  end

  def match_last_name
    [match_query(field: 'last_name', query: last_name, name: '8_exact_last')].compact
  end

  def match_first_name
    [match_query(field: 'first_name', query: first_name, name: '8_no_match_first')].compact
  end

  def reverse_match_last_and_first_name
    rev_last_name_params = generate_match_params('last_name', first_name, '9a_reverse_exact_last',
      nil)
    rev_first_name_params = generate_match_params('first_name', last_name, '9a_reverse_exact_first',
      nil)
    param_list = [rev_last_name_params, rev_first_name_params]
    match_query_list(param_list)
  end

  def reverse_match_last_name_first_name_partial
    rev_last_name_params = generate_match_params('last_name', first_name,
      '9b_reverse_partial_last', nil)
    rev_partial_first_name_params = generate_match_params('first_name_ngram', last_name,
      '9b_reverse_partial_first', '25%')
    param_list = [rev_last_name_params, rev_partial_first_name_params]
    match_query_list(param_list)
  end

  def match_last_name_duplicate
    last_name_params = generate_match_params('last_name', last_name, '10_dupe_exact_last', nil)
    first_name_params = generate_match_params('first_name', last_name, '10_dupe_exact_first', nil)
    param_list = [last_name_params, first_name_params]
    match_query_list(param_list)
  end

  def match_last_and_first_name_partial
    rev_partial_last_name_params = generate_match_params('first_name_ngram', first_name,
      '11_partial_first', '10%')
    rev_partial_first_name_params = generate_match_params('last_name_ngram', last_name,
      '11_partial_last', '15%')
    param_list = [rev_partial_last_name_params, rev_partial_first_name_params]
    match_query_list(param_list)
  end

  def fs_query_params
    [
      { q: match_last_name, not_q: match_first_name, w: 128, bq: true },
      { q: reverse_match_last_and_first_name, w: 64, bq: true },
      { q: reverse_match_last_name_first_name_partial, w: 64, bq: true },
      { q: match_last_name_duplicate, w: 32, bq: true },
      { q: match_last_and_first_name_partial, w: 16, bq: true }
    ].compact
  end
end
