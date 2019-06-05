# frozen_string_literal: true

# PersonSearchByLastMiddleFirstNameQueryBuilder is a service class responsible for creation
# of an elastic search person search query
module PersonSearchByLastMiddleFirstNameQueryBuilderPartTwo
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

  def match_last_name_multi_match_first_middle_phon
    match_last_name('10_exact_last').push(multi_match_first_middle_name_phon).compact
  end

  def match_name_fuzzy(field, value, name)
    params = { field: field, value: value, fuzziness: 'AUTO', prefix_length: '1',
               max_expansions: '50', name: name }
    fuzzy_query(params)
  end

  def match_first_middle_name_fuzzy
    fn_fuzzy_query = match_name_fuzzy('first_name', first_name, '11_fuzzy_first')
    mn_fuzzy_query = match_name_fuzzy('middle_name', middle_name, '11_fuzzy_middle')
    [fn_fuzzy_query, mn_fuzzy_query].compact
  end

  def match_last_middle_name
    last_name_params = last_name_params('12_exact_last')
    middle_name_params = middle_name_params('12_exact_middle')
    param_list = [last_name_params, middle_name_params]
    match_query_list(param_list)
  end

  def match_first_name
    first_name_params = first_name_params('12_no_exact_first')
    param_list = [first_name_params]
    match_query_list(param_list)
  end

  def match_middle_first_to_partials
    first_name_params = generate_match_params('first_name_ngram', first_name, '13_partial_first',
      '15%')
    middle_name_params = generate_match_params('middle_name_ngram', middle_name,
      '13_partial_middle', '15%')
    param_list = [first_name_params, middle_name_params]
    match_query_list(param_list)
  end

  def match_middle_first_name
    middle_name_params = middle_name_params('14_no_exact_middle')
    first_name_params = first_name_params('14_no_exact_first')
    param_list = [middle_name_params, first_name_params]
    match_query_list(param_list)
  end

  def fs_query_params
    [
      { q: match_last_name_middle_name_duplicate, w: 4096, bq: true },
      { q: match_last_name_multi_match_first_middle_phon, w: 2048, bq: true },
      { q: match_last_name('11_exact_last'), should_q: match_first_middle_name_fuzzy,
        w: 1024, bq: true, min_s_m: '1' },
      { q: match_last_middle_name, not_q: match_first_name, w: 512, bq: true },
      { q: match_last_name('13_exact_last'), should_q: match_middle_first_to_partials, w: 256,
        bq: true, min_s_m: '1' },
      { q: match_last_name('14_exact_last'), not_q: match_middle_first_name, w: 128, bq: true }
    ].compact
  end
end
