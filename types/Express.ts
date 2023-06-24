export interface TypedRequestBody<T> extends Express.Request {
  body: T
}
