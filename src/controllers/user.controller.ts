/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import * as UserModel from '../models/user.model'
import { parseRouteId } from '../lib/parseParams'

export const deactivateUserAction = async (req: Request, res: Response) => {
  const id = parseRouteId(req.params.id)
  if (id === null) {
    return res.status(404).render('404', { message: 'Usuario no encontrado' })
  }

  try {
    await UserModel.softDelete(id)
    res.redirect('/affiliates')
  } catch {
    res.status(404).render('404', { message: 'Usuario no encontrado' })
  }
}

export const activateUserAction = async (req: Request, res: Response) => {
  const id = parseRouteId(req.params.id)
  if (id === null) {
    return res.status(404).render('404', { message: 'Usuario no encontrado' })
  }

  try {
    await UserModel.activate(id)
    res.redirect('/affiliates')
  } catch {
    res.status(404).render('404', { message: 'Usuario no encontrado' })
  }
}
