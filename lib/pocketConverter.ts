import { type Article, type SearchItemEdge } from "../types/OmnivoreSchema";
import { type PocketArticleMetadata } from "../types/PocketArticleMetadata";
import {
  type PocketGetArticles,
  type PocketList,
} from "../types/PocketGetArticles";
import { type PocketArticleDownload } from "../types/PocketTextArticle";
import { wordsToReadingTime } from "./utils";

const convertToPocketSchemea = (
  edge: SearchItemEdge
): PocketArticleMetadata => {
  const { node } = edge;

  return {
    item_id: node.id,
    resolved_id: node.slug,
    given_title: node.title,
    given_url: node.slug, // We turn this into the slug so that the subsequent request contains the slug item.
    resolved_title: node.title,
    resolved_url: node.slug,
    has_image: "1",
    word_count: node.wordsCount?.toString()!,
    image: {
      image_id: node.id,
      src: node.image!,
      width: "",
      height: "",
      item_id: node.id,
      caption: "",
      credit: "",
    },
    favorite: "0",
    time_added: Math.floor(
      new Date(node.savedAt.toString()).getTime() / 1000
    ).toString(),
    time_to_read: wordsToReadingTime(node.wordsCount ?? 1),
    time_updated: Math.floor(
      node.updatedAt
        ? new Date(node.updatedAt.toString()).getTime() / 1000
        : new Date(node.savedAt.toString()).getTime() / 1000
    ).toString(),
    time_read: "",
    status: "0",
    time_favorited: "",
    sort_id: 1,
    is_article: "1",
    is_index: "0",
    lang: "en",
    top_image_url: node.image ?? "",
    has_video: "0",
    listen_duration_estimate: 0,
    authors: {
      1: { item_id: "1", author_id: "1", name: node.author ?? "", url: "" },
    },
    excerpt: node.description ?? "",
    images: {},
    domain_metadata: {
      name: node.siteName ?? "",
      logo: node.siteIcon ?? "",
      greyscale_logo: node.siteIcon ?? "",
    },
  };
};

export const articleToPocketFormat = (
  article: Article
): PocketArticleDownload => {
  return {
    resolved_id: article.id,
    resolvedUrl: article.url,
    host: article.url,
    title: article.title,
    datePublished: article.createdAt,
    timePublished: article.createdAt,
    responseCode: 200,
    excerpt: article.description!,
    authors: article.author ?? "",
    images: article.image ?? "",
    videos: "",
    wordCount: article.wordsCount ?? 1,
    isArticle: 1,
    isVideo: 0,
    isIndex: 0,
    usedFallback: 0,
    requiresLogin: 0,
    lang: "en",
    topImageUrl: article.image!,
    article: article.content,
  };
};

export const convertSearchResultsToPocketArticles = (
  articles: SearchItemEdge[]
): PocketGetArticles => {
  const pocketMetadata = articles.map(convertToPocketSchemea);
  const convertedList = pocketMetadata.reduce<PocketList>(
    (prev, curr) => ({ ...prev, [curr.item_id]: curr }),
    {}
  );

  return {
    status: 1,
    complete: 1,
    list: convertedList,
    search_meta: {
      search_type: "normal",
    },
    error: null,
    since: articles[0].node.savedAt,
  };
};
