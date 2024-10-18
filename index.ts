import { Hono } from "hono";
import { OmnivoreClient } from "./lib/omnivoreClient";
import {
  convertSearchResultsToPocketArticles,
  articleToPocketFormat,
} from "./lib/pocketConverter";

type Bindings = {
  OMNI_API_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const getOmnivoreClient = async (
  apiUrl: string,
  token: string
): Promise<OmnivoreClient> => {
  return await OmnivoreClient.createOmnivoreClient(apiUrl, token);
};

app.post("/v3/send", async (c) => {
  const data = await c.req.json();
  const { actions, access_token: accessToken } = data;
  const client = await getOmnivoreClient(c.env.OMNI_API_URL, accessToken);

  const archives = actions
    .filter((it: any) => it.action === "archive")
    .map((it: any) => it.item_id);
  console.log(await Promise.all(archives.map(client.archiveLink, client)));

  return c.json({ action_results: [] });
});

app.post("/v3/get", async (c) => {
  const data = await c.req.json();
  const { access_token: accessToken } = data;

  const client = await getOmnivoreClient(c.env.OMNI_API_URL, accessToken);
  const articles = await client.fetchPages();
  const converted = convertSearchResultsToPocketArticles(articles);
  return c.json(converted);
});

app.post("/v3beta/text", async (c) => {
  const accessToken = c.req.query('access_token');
  const body = await c.req.formData();
  const url = body.get("url")!.toString();

  const client = await getOmnivoreClient(c.env.OMNI_API_URL, accessToken!);
  const article = await client.fetchPage(url);

  return c.json(articleToPocketFormat(article));
});

export default app;
