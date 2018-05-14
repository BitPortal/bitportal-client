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
  title: string,
  updatedAt: string,
}

declare type NewsResult = NewsRow[]
