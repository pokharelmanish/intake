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

  def filter_query(queries: nil, not_queries: nil, weight: nil, bool_query: nil)
    return if queries.blank?
    b = not_queries.nil? ? { must: queries } : { must: queries, must_not: not_queries }
    f = bool_query ? { bool: b } : queries
    { filter: f, weight: weight }.delete_if { |_k, v| v.blank? }
  end

  def function_score_queries(param_list)
    queries = []
    param_list.each do |hash|
      params = { queries: hash[:q], not_queries: hash[:not_q],
                 weight: hash[:w], bool_query: hash[:bq] }.delete_if { |_k, v| v.blank? }
      fq = filter_query(params)
      queries.push(fq)
    end
    queries.flatten.compact
  end
end
