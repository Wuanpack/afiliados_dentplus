/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import * as AffiliateModel from '../models/affiliate.model'
import * as UserModel from '../models/user.model'
import { affiliateSchema } from '../schemas/affiliate.schemas'
import { formatZodErrors } from '../lib/parseError'

/** ADMIN: sin filtro por userId. USER: solo sus afiliados. */
function affiliateScope(req: Request) {
  const { userId, role } = req.session
  const isAdmin = role === 'ADMIN'
  return {
    isAdmin,
    scopeUserId: isAdmin ? undefined : userId!,
  }
}

// Si es ADMIN, muestra los usuarios y los afiliados
// Si es USER, muestra solo sus afiliados con userId
export const index = async (req: Request, res: Response) => {
  const { isAdmin, scopeUserId } = affiliateScope(req)

  const [affiliates, users] = await Promise.all([
    AffiliateModel.getAll(scopeUserId),
    isAdmin ? UserModel.getAllUsers() : Promise.resolve(null),
  ])

  res.render('affiliates/index', { affiliates, users, isAdmin })
}

export const showAffiliateById = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseInt(req.params.id as string)

  const affiliate = await AffiliateModel.getById(id, scopeUserId)
  if (!affiliate) return res.status(404).render('404', { message: 'Afiliado no encontrado ' })
  res.render('affiliates/show', { affiliate })
}

export const createAffiliateForm = (_req: Request, res: Response) => {
  res.render('affiliates/create')
}

export const createAffiliateAction = async (req: Request, res: Response) => {
  const result = affiliateSchema.safeParse(req.body)
  if (!result.success) {
    return res.render('affiliates/create', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })
  }

  const affiliate = await AffiliateModel.create({
    ...result.data,
    userId: req.session.userId!,
  })
  res.redirect(`/affiliates/${affiliate.id}`)
}

export const editAffiliateForm = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseInt(req.params.id as string)

  const affiliate = await AffiliateModel.getById(id, scopeUserId)
  if (!affiliate) return res.status(404).render('404', { message: 'Afiliado no encontrado' })
  res.render('affiliates/edit', { affiliate })
}

export const editAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseInt(req.params.id as string)
  const result = affiliateSchema.safeParse(req.body)

  if (!result.success) {
    const affiliate = await AffiliateModel.getById(id, scopeUserId)
    return res.render('affiliates/edit', {
      affiliate,
      errors: formatZodErrors(result.error),
    })
  }

  try {
    await AffiliateModel.update(id, result.data, scopeUserId)
    res.redirect(`/affiliates/${id}`)
  } catch {
    res.status(404).render('404', { message: 'Afiliado no encontrado' })
  }
}

export const deactivateAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseInt(req.params.id as string)

  try {
    await AffiliateModel.softDelete(id, scopeUserId)
    res.redirect('/affiliates')
  } catch {
    res.status(404).render('404', { message: 'Afiliado no encontrado ' })
  }
}

export const activateAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseInt(req.params.id as string)

  try {
    await AffiliateModel.activate(id, scopeUserId)
    res.redirect('/affiliates')
  } catch {
    res.status(404).render('404', { message: 'Afiliado no encontrado ' })
  }
}
