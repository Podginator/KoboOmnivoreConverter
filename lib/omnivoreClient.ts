import {
  type Article,
  type SearchItemEdge,
  type ArticleSuccess,
  type SearchSuccess,
} from "../types/OmnivoreSchema";

export class OmnivoreClient {
  apiUrl: string;
  username: string;
  token: string;

  private constructor(apiUrl: string, username: string, token: string) {
    this.apiUrl = apiUrl;
    this.username = username;
    this.token = token;
  }

  static async createOmnivoreClient(
    apiUrl: string,
    token: string
  ): Promise<OmnivoreClient> {
    return new OmnivoreClient(
      apiUrl,
      await this.getUsername(apiUrl, token),
      token
    );
  }

  private static async getUsername(
    apiUrl: string,
    token: string
  ): Promise<string> {
    console.log("username", token);
    const data = JSON.stringify({
      query: `query GetUsername {
          me {
            profile {
              username
            }
          }
        }
    `,
    });

    const response = await fetch(`${apiUrl}/graphql`, {
      method: "POST",
      headers: {
        Cookie: `auth=${token};`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.me.profile.username;
  }

  async fetchPages(): Promise<SearchItemEdge[]> {
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
      variables: { query: "in:inbox", after: "0", first: 1000 },
    };

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: "POST",
      headers: {
        Cookie: `auth=${this.token};`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: { data: { search: SearchSuccess } } = await response.json();
    return result.data.search.edges;
  }

  async fetchPage(slug: string): Promise<Article> {
    const data = JSON.stringify({
      variables: {
        username: this.username,
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

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: "POST",
      headers: {
        Cookie: `auth=${this.token};`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: { data: { article: ArticleSuccess } } = await response.json();
    return result.data.article.article;
  }

  async archiveLink(id: string): Promise<boolean> {
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

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: "POST",
      headers: {
        Cookie: `auth=${this.token};`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation, variables: { id } }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  }
}
