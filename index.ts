import http from 'http'
import express, { type Response } from 'express'
import { attachOmnivoreClientMiddleware, type KoboRequestBody } from './types/Express'
import bodyParser from 'body-parser'
import {
  convertSearchResultsToPocketArticles,
  articleToPocketFormat
} from './lib/pocketConverter';

(async () => {
  const proxyApp = express()

  proxyApp.use(attachOmnivoreClientMiddleware)
  proxyApp.use(bodyParser.json())
  proxyApp.use(bodyParser.urlencoded({ extended: true }))

  proxyApp.post(
    '/v3/send',
    async (
      req: KoboRequestBody<{ actions: Array<{ action: string, item_id: string }> }>,
      res: Response
    ): Promise<void> => {
      const { actions } = req.body

      const archives = actions
        .filter((it) => it.action === 'archive')
        .map((it) => it.item_id)
      console.log(await Promise.all(archives.map(req.omnivoreClient.archiveLink)))

      res.send({ action_results: [] })
    }
  )

  proxyApp.post('/v3/get', async (req: KoboRequestBody<unknown>, res: Response): Promise<void> => {
    const articles = await req.omnivoreClient?.fetchPages()
    const converted = convertSearchResultsToPocketArticles(articles)

    res.send(converted)
  })

  proxyApp.post(
    '/v3beta/text',
    async (req: KoboRequestBody<{ url: string }>, res: Response): Promise<void> => {
      const { url } = req.body
      const article = await req.omnivoreClient?.fetchPage(url)

      res.send(articleToPocketFormat(article))
    }
  )

  // Create a basic HTTP server
  const server = http.createServer(proxyApp)

  // Start the server on port 8080
  server.listen(80, () => {
    console.log('Server running on port 5090')
  })
})()
