import {
  AnilistMedia,
  AnilistPage,
  AnilistResponse,
  SearchAnilistMediaParams,
} from "@/@types/types";
async function fetchAnilistApi<T>(
  query: string,
  variables?: Record<string, any>,
  revalidateTime: number = 3600
): Promise<AnilistResponse<T> | null> {
  const ANILIST_API_URL = "https://graphql.anilist.co";
  const ANILIST_REQUEST_DELAY = 100;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: revalidateTime },
  };

  await new Promise((resolve) => setTimeout(resolve, ANILIST_REQUEST_DELAY));

  try {
    const response = await fetch(ANILIST_API_URL, options);
    const responseData = await response.json();

    if (!response.ok || responseData.errors) {
      console.error(
        "AniList API Error:",
        response.status,
        response.statusText,
        JSON.stringify(
          responseData.errors || { message: "Unknown API error structure" },
          null,
          2
        )
      );
      return {
        data: null as any,
        errors: responseData.errors || [
          { message: `HTTP error ${response.status}` },
        ],
      };
    }
    return responseData as AnilistResponse<T>;
  } catch (error) {
    console.error(
      "Network or JSON parsing error fetching from AniList API:",
      error
    );
    return {
      data: null as any,
      errors: [
        {
          message:
            error instanceof Error
              ? error.message
              : "A network or parsing error occurred",
        },
      ],
    };
  }
}

const MEDIA_FRAGMENT_ANILIST_CORE = `
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  format
  status
  description(asHtml: true)
  startDate { year month day }
  endDate { year month day }
  season
  seasonYear
  episodes
  duration
  countryOfOrigin
  source(version: 2)
  trailer { id site thumbnail }
  coverImage { large medium extraLarge color } # Added extraLarge and color
  bannerImage
  genres
  synonyms
  averageScore
  meanScore
  popularity
  favourites
  isAdult
  siteUrl
  studios(isMain: true) {
    edges {
      node {
        id
        name
        isAnimationStudio
      }
    }
  }
  tags {
    id
    name
    rank
    isMediaSpoiler
  }
  nextAiringEpisode { # Added for calendar/schedule
    airingAt
    timeUntilAiring
    episode
  }
`;

const MEDIA_FRAGMENT_ANILIST_DETAILS = `
  ${MEDIA_FRAGMENT_ANILIST_CORE}
  relations {
    edges {
      id
      relationType(version: 2)
      node {
        id
        title { userPreferred }
        format
        type # Added type for relations
        status
        coverImage { medium }
        siteUrl
      }
    }
  }
  characters(sort: [ROLE, RELEVANCE, ID], perPage: 12, page: 1) {
    pageInfo { hasNextPage }
    edges {
      id
      role
      node {
        id
        name { userPreferred native }
        image { large medium }
        siteUrl
        description(asHtml: false)
      }
      voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) { # Changed from voiceActor to voiceActors
        id
        name { userPreferred }
        image { medium }
        languageV2
        siteUrl
      }
    }
  }
  recommendations(sort: [RATING_DESC, ID], perPage: 8) {
    pageInfo { hasNextPage }
    nodes {
      id
      rating
      mediaRecommendation {
        id
        title { userPreferred }
        format
        type
        status
        coverImage { medium }
        averageScore
        siteUrl
      }
    }
  }
`;

export async function getAnilistMediaById(
  id: number,
  isMalId: boolean = false
): Promise<AnilistResponse<{ Media: AnilistMedia | null }> | null> {
  const variables: { mediaId?: number; malId?: number; type: string } = {
    type: "ANIME",
  };
  if (isMalId) {
    variables.malId = id;
  } else {
    variables.mediaId = id;
  }
  const query = `
    query ($mediaId: Int, $malId: Int, $type: MediaType) {
      Media(id: $mediaId, idMal: $malId, type: $type) {
        ${MEDIA_FRAGMENT_ANILIST_DETAILS}
      }
    }`;
  return fetchAnilistApi<{ Media: AnilistMedia | null }>(
    query,
    variables,
    86400
  );
}

export async function searchAnilistMedia(
  params: SearchAnilistMediaParams
): Promise<AnilistResponse<{ Page: AnilistPage }> | null> {
  const {
    page = 1,
    perPage = 24,
    sort = ["POPULARITY_DESC"],
    isAdult = false,
    ...rest
  } = params;

  const variables: Record<string, any> = {
    page,
    perPage,
    sort,
    isAdult,
    type: "ANIME",
  };

  for (const key in rest) {
    if (Object.prototype.hasOwnProperty.call(rest, key)) {
      const value = (rest as Record<string, any>)[key];
      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value !== "") &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        variables[key] = value;
      }
    }
  }

  if (
    variables.format &&
    !Array.isArray(variables.format) &&
    variables.format_in === undefined
  ) {
    variables.format_in = [variables.format];
    delete variables.format;
  }
  if (
    variables.status &&
    !Array.isArray(variables.status) &&
    variables.status_in === undefined
  ) {
    variables.status_in = [variables.status];
    delete variables.status;
  }
  if (
    variables.source &&
    !Array.isArray(variables.source) &&
    variables.source_in === undefined
  ) {
    variables.source_in = [variables.source];
    delete variables.source;
  }

  if (variables.genres && !Array.isArray(variables.genres)) {
    variables.genre_in = [variables.genres];
    delete variables.genres;
  } else if (variables.genres && Array.isArray(variables.genres)) {
    variables.genre_in = variables.genres;
    delete variables.genres;
  }

  if (variables.tags && !Array.isArray(variables.tags)) {
    variables.tag_in = [variables.tags];
    delete variables.tags;
  } else if (variables.tags && Array.isArray(variables.tags)) {
    variables.tag_in = variables.tags;
    delete variables.tags;
  }

  const query = `
    query (
      $page: Int,
      $perPage: Int,
      $search: String,
      $sort: [MediaSort],
      $genre_in: [String],
      $tag_in: [String],
      $season: MediaSeason,
      $seasonYear: Int,
      $format_in: [MediaFormat],
      $status_in: [MediaStatus],
      $source_in: [MediaSource],
      $isAdult: Boolean,
      $id_in: [Int],
      $idMal_in: [Int],
      $type: MediaType
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(
          search: $search,
          type: $type,
          sort: $sort,
          genre_in: $genre_in,
          tag_in: $tag_in,
          season: $season,
          seasonYear: $seasonYear,
          format_in: $format_in,
          status_in: $status_in,
          source_in: $source_in,
          isAdult: $isAdult,
          id_in: $id_in,
          idMal_in: $idMal_in
        ) {
          ${MEDIA_FRAGMENT_ANILIST_CORE}
        }
      }
    }`;
  return fetchAnilistApi<{ Page: AnilistPage }>(query, variables, 900);
}

export async function getTrendingAnilistMedia(
  page: number = 1,
  perPage: number = 12
): Promise<AnilistResponse<{ Page: AnilistPage }> | null> {
  return searchAnilistMedia({
    page,
    perPage,
    sort: ["TRENDING_DESC", "POPULARITY_DESC"],
  });
}

export async function getSeasonAnilistMedia(
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
  seasonYear: number,
  page: number = 1,
  perPage: number = 6,
  sort: string[] = ["POPULARITY_DESC"]
): Promise<AnilistResponse<{ Page: AnilistPage }> | null> {
  return searchAnilistMedia({ season, seasonYear, page, perPage, sort });
}
