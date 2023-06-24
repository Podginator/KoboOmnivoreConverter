import axios, { type AxiosResponse } from "axios";
import {
  type Article,
  type SearchItemEdge,
  type ArticleSuccess,
  type SearchSuccess,
} from "../types/OmnivoreSchema";

const API_URL =
  process.env.OMNIVORE_API_URL ?? "https://api-prod.omnivore.app/api";

export const fetchPages = async (): Promise<SearchItemEdge[]> => {
  const data = {
    query: `query Search($after: String, $first: Int, $query: String) {
            search(first: $first, after: $after, query: $query) {
              ... on SearchSuccess {
                edges {
                  cursor
                  node {
                    id
                    title
                    slug
                    url
                    pageType
                    contentReader
                    createdAt
                    isArchived
                    author
                    image
                    description
                    publishedAt
                    ownedByViewer
                    originalArticleUrl
                    uploadFileId
                    labels {
                      id
                      name
                      color
                    }
                    pageId
                    shortId
                    quote
                    annotation
                    state
                    siteName
                    subscription
                    readAt
                    savedAt
                    wordsCount
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                  totalCount
                }
              }
              ... on SearchError {
                errorCodes
              }
            }
          }`,
    variables: { query: "in:inbox", after: "1", first: 100 },
  };

  const response: AxiosResponse<{ data: { search: SearchSuccess } }> =
    await axios
      .post(`${API_URL}/graphql`, data, {
        headers: {
          Cookie: `auth=${process.env.OMNIVORE_AUTH_TOKEN!};`,
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });

  return response.data.data.search.edges;
};

export const fetchPage = async (
  username = "Podginator",
  slug: string
): Promise<Article> => {
  const data = JSON.stringify({
    variables: {
      username,
      slug,
    },
    query: `query GetArticle(
        $username: String!
        $slug: String!
      ) {
        article(username: $username, slug: $slug) {
          ... on ArticleSuccess {
            article {
              id, 
              title,
              url,
              author, 
              savedAt,
              description,
              image
              content
            }
          }
          ... on ArticleError {
            errorCodes
          }
        }
      }
  `,
  });

  const response: AxiosResponse<{ data: { article: ArticleSuccess } }> =
    await axios.post(`${API_URL}/graphql`, data, {
      headers: {
        Cookie: `auth=${process.env.OMNIVORE_AUTH_TOKEN!};`,
        "Content-Type": "application/json",
      },
    });

  return response.data.data.article.article;
};

export const archiveLink = async (id: string): Promise<boolean> => {
  const mutation = `mutation ArchivePage($id: ID!) {
        setLinkArchived (input: {linkId: $id, archived: true}) {
            ... on ArchiveLinkSuccess {
                linkId
                message
            }
            ... on ArchiveLinkError {
                message
                errorCodes
            }
        }
    }`;

  return await axios
    .post(
      `${API_URL}/graphql`,
      { query: mutation, variables: { id } },
      {
        headers: {
          Cookie: `auth=${process.env.OMNIVORE_AUTH_TOKEN!};`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((_) => true);
};
