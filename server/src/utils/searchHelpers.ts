import Book from "../models/bookModel.js";

/**
 * Helper function to build the search stage for Atlas Search
 */
export const buildSearchStage = (
  searchTerm: string,
  indexName: string = "elasticSearch"
) => {
  return {
    $search: {
      index: indexName,
      compound: {
        should: [
          {
            text: {
              query: searchTerm,
              path: ["title", "description", "authorName", "genres"],
              score: { boost: { value: 3 } },
            },
          },
          {
            autocomplete: {
              query: searchTerm,
              path: "title",
              score: { boost: { value: 2 } },
            },
          },
          {
            autocomplete: {
              query: searchTerm,
              path: "authorName",
              score: { boost: { value: 2 } },
            },
          },
          {
            text: {
              query: searchTerm,
              path: "genres",
              score: { boost: { value: 1.5 } },
            },
          },
        ],
      },
    },
  };
};

/**
 * Helper function to build match stage for filtering
 */
export const buildMatchStage = (
  title?: string,
  author?: string,
  genres?: string[],
  match?: string,
  priceMin?: string,
  priceMax?: string,
  isSearchQuery?: boolean
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchStage: any = {};

  // Only use regex filters if not using full-text search
  if (title && !isSearchQuery) {
    matchStage.title = { $regex: title, $options: "i" };
  }

  if (author && !isSearchQuery) {
    matchStage.authorName = { $regex: author, $options: "i" };
  }

  // Genre filtering works with both search and regular queries
  if (genres) {
    if (match === "any") {
      matchStage.genres = { $in: genres };
    } else if (match === "all") {
      matchStage.genres = { $all: genres };
    }
  }

  // Price filtering
  if (priceMin || priceMax) {
    matchStage.price = {};
    if (priceMin) matchStage.price.$gte = parseFloat(priceMin);
    if (priceMax) matchStage.price.$lte = parseFloat(priceMax);
  }

  return matchStage;
};

/**
 * Helper function to build sort stage
 */
export const buildSortStage = (sortBy: string, isSearchQuery: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortStage: any = {};

  if (isSearchQuery) {
    // Sort by search relevance first when using search
    sortStage.searchScore = -1;

    // Add secondary sort if specified and different from default
    if (sortBy !== "-ratingAverage") {
      const sortFields = sortBy.split(",");
      sortFields.forEach((field) => {
        const fieldName = field.startsWith("-") ? field.substring(1) : field;
        const direction = field.startsWith("-") ? -1 : 1;
        if (fieldName !== "searchScore") {
          sortStage[fieldName] = direction;
        }
      });
    } else {
      sortStage.ratingAverage = -1;
    }
  } else {
    // Regular sorting when not using search
    const sortFields = sortBy.split(",");
    sortFields.forEach((field) => {
      const fieldName = field.startsWith("-") ? field.substring(1) : field;
      const direction = field.startsWith("-") ? -1 : 1;
      sortStage[fieldName] = direction;
    });
  }

  return sortStage;
};

/**
 * Helper function to build projection stage for field selection
 */
export const buildProjectionStage = (fields?: string) => {
  if (fields) {
    const selectFields = fields.split(",").reduce((acc, field) => {
      acc[field.trim()] = 1;
      return acc;
    }, {} as Record<string, number>);
    return { $project: selectFields };
  } else {
    return { $project: { __v: 0 } };
  }
};

/**
 * Helper function to build the aggregation pipeline
 */
export const buildAggregationPipeline = (
  search?: string,
  title?: string,
  author?: string,
  genres?: string[],
  match?: string,
  priceMin?: string,
  priceMax?: string,
  sortBy: string = "-ratingAverage",
  fields?: string,
  skip: number = 0,
  limit: number = 10
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [];
  const isSearchQuery = !!search;

  // Add search stage if search parameter exists
  if (search) {
    pipeline.push(buildSearchStage(search));
  }

  // Add match stage for filtering
  const matchStage = buildMatchStage(
    title,
    author,
    genres,
    match,
    priceMin,
    priceMax,
    isSearchQuery
  );
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Add search score for sorting (only if search was used)
  if (search) {
    pipeline.push({
      $addFields: {
        searchScore: { $meta: "searchScore" },
      },
    });
  }

  // Add sorting
  const sortStage = buildSortStage(sortBy, isSearchQuery);
  pipeline.push({ $sort: sortStage });

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Add field selection
  pipeline.push(buildProjectionStage(fields));

  return pipeline;
};

/**
 * Helper function to count total documents
 */
export const countDocuments = async (
  search?: string,
  title?: string,
  author?: string,
  genres?: string[],
  match?: string,
  priceMin?: string,
  priceMax?: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countPipeline: any[] = [];
  const isSearchQuery = !!search;

  // Add search stage if search parameter exists
  if (search) {
    countPipeline.push(buildSearchStage(search));
  }

  // Add match stage for filtering
  const matchStage = buildMatchStage(
    title,
    author,
    genres,
    match,
    priceMin,
    priceMax,
    isSearchQuery
  );
  if (Object.keys(matchStage).length > 0) {
    countPipeline.push({ $match: matchStage });
  }

  // Count documents
  countPipeline.push({ $count: "total" });

  const countResult = await Book.aggregate(countPipeline);
  return countResult[0]?.total || 0;
};
