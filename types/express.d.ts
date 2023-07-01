import { type OmnivoreClient } from '../lib/omnivoreClient'

declare global {
  namespace Express {
    interface Request {
      omnivoreClient: OmnivoreClient
    }
  }
}
