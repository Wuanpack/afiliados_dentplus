/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import * as UserModel from '../models/user.model'
import { parseRouteId } from '../lib/parseParams'

const NOT_FOUND_USER = 'Usuario no encontrado'

function notFoundUser(res: Response) {
  return res.status(404).render('404', { message: NOT_FOUND_USER })
}

export const deactivateUserAction = async (req: Request, res: Response) => {
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundUser(res)

  if (id === req.session.userId) {
    return res.status(403).render('403', {
      message: 'No puedes desactivar tu propia cuenta',
    })
  }

  try {
    await UserModel.softDelete(id)
    res.redirect('/affiliates')
  } catch {
    return notFoundUser(res)
  }
}

export const activateUserAction = async (req: Request, res: Response) => {
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundUser(res)

  try {
    await UserModel.activate(id)
    res.redirect('/affiliates')
  } catch {
    return notFoundUser(res)
  }
}
