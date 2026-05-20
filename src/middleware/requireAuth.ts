import { Request, Response, NextFunction } from 'express'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || !req.session.role) {
    return res.redirect('/login')
  }
  next()
}
