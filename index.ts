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
  const omnivoreClient = await OmnivoreClient.createOmnivoreClient();

  proxyApp.use(bodyParser.json());
  proxyApp.use(bodyParser.urlencoded({ extended: true }));

  proxyApp.post(
    "/v3/send",
    async (
      req: TypedRequestBody<{
        actions: Array<{ action: string; item_id: string }>;
      }>,
      res: Response
    ): Promise<void> => {
      const { body } = req;
      const { actions } = body;

      const archives = actions
        .filter((it) => it.action === "archive")
        .map((it) => it.item_id);
      console.log(await Promise.all(archives.map(omnivoreClient.archiveLink)));

      res.send({ action_results: [] });
    }
  );

  proxyApp.post("/v3/get", async (req: Request, res: Response): Promise<void> => {
    console.log("Converting Latest articles from Omnivore");
    const articles = await omnivoreClient.fetchPages();
    const converted = convertSearchResultsToPocketArticles(articles);

    res.send(converted);
  });

  proxyApp.post(
    "/v3beta/text",
    async (req: Request, res: Response): Promise<void> => {
      const { url } = req.body;

      const article = await omnivoreClient.fetchPage("Podginator", url);

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