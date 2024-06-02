import http from "http";
import express, { type Request, type Response } from "express";
import { type TypedRequestBody } from "./types/Express";
import bodyParser from "body-parser";
import { OmnivoreClient } from "./lib/omnivoreClient"
import {
  convertSearchResultsToPocketArticles,
  articleToPocketFormat,
} from "./lib/pocketConverter";

(async () => { 
  const proxyApp = express();
  let omnivoreClient: null | OmnivoreClient = null;
  const getOmnivoreClient = async (token: string) => {
    if (!omnivoreClient) {  
      omnivoreClient = await OmnivoreClient.createOmnivoreClient(token);
    }

    return omnivoreClient;
  }

  proxyApp.use(bodyParser.json());
  proxyApp.use(bodyParser.urlencoded({ extended: true }));

  proxyApp.post(
    "/v3/send",
    async (
      req: TypedRequestBody<{
        actions: Array<{ action: string; item_id: string }>;
        access_token: string;
      }>,
      res: Response
    ): Promise<void> => {
      const { actions, access_token } = req.body;
      const client = await getOmnivoreClient(access_token);

      const archives = actions
        .filter((it) => it.action === "archive")
        .map((it) => it.item_id);
      console.log(await Promise.all(archives.map(client.archiveLink, client)));

      res.send({ action_results: [] });
    }
  );

  proxyApp.post("/v3/get", async (req: Request, res: Response): Promise<void> => {
    const client = await getOmnivoreClient(req.body.access_token);
    const articles = await client.fetchPages();
    const converted = convertSearchResultsToPocketArticles(articles);

    res.send(converted);
  });

  proxyApp.post(
    "/v3beta/text",
    async (req: Request, res: Response): Promise<void> => {
      const { url, access_token } = req.body;
      const client = await getOmnivoreClient(access_token);
      const article = await client.fetchPage(url);

      res.send(articleToPocketFormat(article));
    }
  );

  // Create a basic HTTP server
  const server = http.createServer(proxyApp);

  // Start the server on port 8080
  server.listen(80, () => {
    console.log("Server running on port 5090");
  });
})();