// middlewares/asyncHandler.ts
import { Router } from 'express'
export default (router: Router) =>
  Router().use((req, res, next) => Promise.resolve(router(req, res, next)).catch(next))