import { Request, Response, NextFunction } from 'express'

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.role !== 'ADMIN') {
    return res.status(403).render('403', {
      message: 'No tienes los permisos necesarios',
    })
  }
  next()
}
