declare interface NewsParams = {
  startAt: number,
  limit: number,
}

declare interface NewsRow = {
  content: string,
  createAt: string,
  id: string,
  img_url: string,
  language: string,
  publisher: string,
  status: string,
  // TODO: wrong spelling in API
  tittle: string,
  updatedAt: string,
}

declare type NewsResult = NewsRow[]
