# frozen_string_literal: true

# PersonSearchByLastMiddleFirstNameQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByLastMiddleFirstNameQueryBuilderPartThree
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

  def match_last_name_middle_name_duplicate
    first_name_dup_params = generate_match_params('first_name', middle_name, '9_dupe_first', nil)
    middle_name_dup_params = middle_name_params('9_dupe_middle')
    param_list = [last_name_params('9_exact_last'), first_name_dup_params, middle_name_dup_params]
    match_query_list(param_list)
  end

  def multi_match_first_middle_name_phon
    params = {
      query: formatted_query("#{first_name} #{middle_name}"),
      operator: 'or',
      fields: %w[first_name.phonetic middle_name.phonetic],
      type: 'cross_fields',
      name: '10_phonetic_first_or_middle'
    }
    multi_match(params)
  end

  def match_first_partial_by_middle
    first_name_params = generate_match_params('first_name_ngram', middle_name,
      '15_partial_first_by_middle', '15%')
    match_query(first_name_params)
  end

  def match_first_partial_by_last
    first_name_params = generate_match_params('first_name_ngram', last_name,
      '15_partial_first_by_last', '15%')
    match_query(first_name_params)
  end

  def match_middle_partial_by_first
    first_name_params = generate_match_params('middle_name_ngram', first_name,
      '15_partial_middle_by_first', '15%')
    match_query(first_name_params)
  end

  def match_middle_partial_by_last
    first_name_params = generate_match_params('middle_name_ngram', last_name,
      '15_partial_middle_by_last', '15%')
    match_query(first_name_params)
  end

  def match_last_partial_by_first
    first_name_params = generate_match_params('last_name_ngram', first_name,
      '15_partial_last_by_first', '15%')
    match_query(first_name_params)
  end

  def match_last_partial_by_middle
    first_name_params = generate_match_params('last_name_ngram', middle_name,
      '15_partial_last_by_middle', '15%')
    match_query(first_name_params)
  end

  def match_last_middle_first_partials_by_inverse_names
    [
      match_first_partial_by_middle, match_first_partial_by_last, match_middle_partial_by_first,
      match_middle_partial_by_last, match_last_partial_by_first, match_last_partial_by_middle
    ].compact
  end

  def match_last_middle_first_name_to_last
    last_name_params = last_name_params('16_duplicate_last')
    middle_name_params = generate_match_params('middle_name', last_name, '16_duplicate_middle',
      nil)
    first_name_params = generate_match_params('first_name', last_name, '16_duplicate_first', nil)
    param_list = [last_name_params, middle_name_params, first_name_params]
    match_query_list(param_list)
  end

  def match_last_middle_first_to_partials
    first_name_params = generate_match_params('first_name_ngram', first_name, '17_partial_first',
      '15%')
    middle_name_params = generate_match_params('middle_name_ngram', middle_name,
      '17_partial_middle', '15%')
    last_name_params = generate_match_params('last_name_ngram', last_name, '17_partial_last', '15%')
    param_list = [first_name_params, middle_name_params, last_name_params]
    match_query_list(param_list)
  end

  def fs_query_params
    [
      { should_q: match_last_middle_first_partials_by_inverse_names, w: 64, bq: true,
        min_s_m: '3' },
      { q: match_last_middle_first_name_to_last, w: 32, bq: true },
      { q: match_last_middle_first_to_partials, w: 16, bq: true }
    ].compact
  end
end
