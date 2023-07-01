import { type NextFunction, type Request, type Response } from 'express'
import { OmnivoreClient } from '../lib/omnivoreClient'

export interface KoboRequestBody<T> extends Express.Request {
  body: T
}
export const attachOmnivoreClientMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const { access_token } = req.body
  req.omnivoreClient = await OmnivoreClient.createOmnivoreClient(access_token)

  return next()
}
