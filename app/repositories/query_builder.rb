# frozen_string_literal: true

# class for dora search
class QueryBuilder < BaseQueryBuilder
  def self.build_base(builder)
    if builder.client_id_searched?
      builder.extend(PersonSearchByClientId).build_query(builder)
    elsif builder.ssn_searched?
      builder.extend(PersonSearchSsnQueryBuilder).build_query(builder)
    elsif builder.advanced_search_on?
      build_advanced_search(builder)
    else
      builder.extend(PersonSearchQueryBuilder).build_query(builder)
    end
  end

  def self.build_advanced_search(builder)
    search_by_name(builder)
    search_by_age_query(builder)
    search_by_sex_at_birth(builder)
  end

  def self.search_by_name(builder)
    if builder.last_name_only?
      search_by_last_name(builder)
    elsif builder.last_name_and_suffix_only?
      search_by_last_name_and_suffix(builder)
    elsif builder.last_first_name_only?
      search_by_last_and_first_name(builder)
    else
      search_by_last_middle_and_first_name(builder)
    end
  end

  def self.search_by_last_name(builder)
    builder.extend(PersonSearchByLastNameQueryBuilder).build_query(builder)
  end

  def self.search_by_last_name_and_suffix(builder)
    builder.extend(PersonSearchByLastNameSuffixQueryBuilder).build_query(builder)
  end

  def self.search_by_last_and_first_name(builder)
    builder.extend(PersonSearchByLastFirstNameQueryBuilderPartOne).build_query(builder)
    builder.extend(PersonSearchByLastFirstNameQueryBuilderPartTwo).build_query(builder)
  end

  def self.search_by_last_middle_and_first_name(builder)
    builder.extend(PersonSearchByLastMiddleFirstNameQueryBuilderPartOne).build_query(builder)
    builder.extend(PersonSearchByLastMiddleFirstNameQueryBuilderPartTwo).build_query(builder)
    builder.extend(PersonSearchByLastMiddleFirstNameQueryBuilderPartThree).build_query(builder)
  end

  def self.search_by_age_query(builder)
    if builder.age_search_method == 'dob'
      builder.extend(PersonSearchByDateOfBirthQueryBuilder).build_query(builder)
    elsif builder.age_search_method == 'approximate'
      builder.extend(PersonSearchByApproximateAgeQueryBuilder).build_query(builder)
    end
  end

  def self.search_by_sex_at_birth(builder)
    builder.extend(PersonSearchBySexAtBirthQueryBuilder).build_query(builder)
  end
end
