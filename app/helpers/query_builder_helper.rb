# frozen_string_literal: true

# query builder helper
module QueryBuilderHelper
  NUMBER_OF_FRAGMENTS = '10'
  NO_BOOST = '1'
  LOW_BOOST = '2'
  MEDIUM_BOOST = '4'
  HIGH_BOOST = '14'
  SUPER_BOOST = '20'
  TRACK_SCORES = 'true'
  REQUIRE_FIELD_MATCH = 'false'
  MIN_SCORE = '2.5'

  def formatted_query(string)
    string.to_s.downcase
          .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
          .gsub(/[_%]/, '_' => '?', '%' => '*')
          .strip
  end

  def generate_match_params(field, query, name, min_s_m)
    { field: field, query: query, name: name, min_s_m: min_s_m }.delete_if { |_k, v| v.blank? }
  end

  def last_name_params(name)
    generate_match_params('last_name', last_name, name, nil)
  end

  def middle_name_params(name)
    generate_match_params('middle_name', middle_name, name, nil)
  end

  def first_name_params(name)
    generate_match_params('first_name', first_name, name, nil)
  end

  def match_last_name(name)
    last_name_params = last_name_params(name)
    param_list = [last_name_params]
    match_query_list(param_list)
  end

  def generate_query_params(params)
    {
      query: params[:query], value: params[:value], operator: params[:operator],
      boost: params[:boost], minimum_should_match: params[:min_s_m],
      _name: params[:name], fuzziness: params[:fuzziness], prefix_length: params[:prefix_length],
      max_expansions: params[:max_expansions], fields: params[:fields], type: params[:type]
    }.delete_if { |_k, v| v.blank? }
  end

  def match_query(params)
    return if params[:query].blank? && params[:value].blank?
    field_params = generate_query_params(params)
    { match: { params[:field] => field_params } }
  end

  def fuzzy_query(params)
    return if params[:query].blank? && params[:value].blank?
    field_params = generate_query_params(params)
    { fuzzy: { params[:field] => field_params } }
  end

  def match_query_list(param_list)
    queries = []
    param_list.each do |hash|
      q = match_query(hash)
      queries.push(q)
    end
    queries.flatten.compact
  end

  def query_string(field, query, boost: nil)
    return if query.blank?
    { query_string: {
      default_field: field,
      query: query,
      boost: boost
    }.delete_if { |_k, v| v.blank? } }
  end

  def multi_match(params)
    return if params[:query].blank?
    multi_match_params = generate_query_params(params)
    { multi_match: multi_match_params }
  end

  def filter_query(queries: nil, weight: nil, bool_query: nil, min_s_m: nil)
    must_queries = queries[:must_queries]
    not_queries = queries[:not_queries]
    should_queries = queries[:should_queries]
    return if must_queries.blank? && not_queries.blank? && should_queries.blank?
    b = { must: must_queries, must_not: not_queries, should: should_queries,
          minimum_should_match: min_s_m }.delete_if { |_k, v| v.blank? }
    f = bool_query ? { bool: b } : must_queries
    { filter: f, weight: weight }.delete_if { |_k, v| v.blank? }
  end

  def function_score_queries(param_list)
    query_list = []
    param_list.each do |hash|
      queries = { must_queries: hash[:q], not_queries: hash[:not_q],
                  should_queries: hash[:should_q] }
      params = { queries: queries, weight: hash[:w], bool_query: hash[:bq],
                 min_s_m: hash[:min_s_m] }.delete_if { |_k, v| v.blank? }
      fq = filter_query(params)
      query_list.push(fq)
    end
    query_list.flatten.compact
  end
end
