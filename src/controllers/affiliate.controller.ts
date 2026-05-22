/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import * as AffiliateModel from '../models/affiliate.model'
import * as MembershipModel from '../models/membership.model'
import * as UserModel from '../models/user.model'
import { simulatorSchema } from '../schemas/simulator.schemas'
import { affiliateSchema } from '../schemas/affiliate.schemas'
import { affiliateScope } from '../lib/affiliateScope'
import { formatZodErrors } from '../lib/parseError'
import { parseRouteId } from '../lib/parseParams'
import { isUniqueConstraintError } from '../lib/prismaErrors'

const NOT_FOUND_AFFILIATE = 'Afiliado no encontrado'

function notFoundAffiliate(res: Response) {
  return res.status(404).render('404', { message: NOT_FOUND_AFFILIATE })
}

export const index = async (req: Request, res: Response) => {
  const { isAdmin, scopeUserId } = affiliateScope(req)

  const [affiliates, users] = await Promise.all([
    AffiliateModel.getAll(scopeUserId),
    isAdmin ? UserModel.getAllUsers() : Promise.resolve(null),
  ])

  res.render('affiliates/index', { affiliates, users, isAdmin })
}

export const showAffiliateById = async (req: Request, res: Response) => {
    const { scopeUserId, isAdmin } = affiliateScope(req)
    const id = parseRouteId(req.params.id)

    if (id === null) return notFoundAffiliate(res)

    const affiliate = await AffiliateModel.getById(id, scopeUserId)
    if (!affiliate) return notFoundAffiliate(res)

    // si no hay número ingresado, renderiza sin calcular
    if (!req.body || !req.body.numeroIngresado) {
      return res.render('affiliates/show', { affiliate, isAdmin })
    }   

    const result = simulatorSchema.safeParse(req.body)
    if (!result.success) {
        return res.render('affiliates/show', {
            affiliate,  // ← ¿está aquí?
            isAdmin,
            errors: formatZodErrors(result.error),
            values: req.body
        })
    }

    const monto = result.data.numeroIngresado
    const descuento = affiliate.membershipType.discount
    const total = monto - (descuento * monto)

    res.render('affiliates/show', { affiliate, isAdmin, total, values: req.body })
}

export const createAffiliateForm = async (_req: Request, res: Response) => {
  const membershipTypes = await MembershipModel.getAll()
  res.render('affiliates/create', { membershipTypes })
}

export const createAffiliateAction = async (req: Request, res: Response) => {
  const membershipTypes = await MembershipModel.getAll()
  const result = affiliateSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('affiliates/create', {
      errors: formatZodErrors(result.error),
      values: req.body,
      membershipTypes,
    })
  }

  try {
    const affiliate = await AffiliateModel.create({
      ...result.data,
      userId: req.session.userId!,
    })
    res.redirect(`/affiliates/${affiliate.id}`)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.render('affiliates/create', {
        errors: { email: 'Este email ya está registrado' },
        values: req.body,
        membershipTypes,
      })
    }
    throw error
  }
}

export const editAffiliateForm = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundAffiliate(res)

  const [affiliate, membershipTypes] = await Promise.all([
    AffiliateModel.getById(id, scopeUserId),
    MembershipModel.getAll(),
  ])

  if (!affiliate) return notFoundAffiliate(res)
  res.render('affiliates/edit', { affiliate, membershipTypes })
}

export const editAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundAffiliate(res)

  const membershipTypes = await MembershipModel.getAll()
  const result = affiliateSchema.safeParse(req.body)

  if (!result.success) {
    const affiliate = await AffiliateModel.getById(id, scopeUserId)
    if (!affiliate) return notFoundAffiliate(res)
    return res.render('affiliates/edit', {
      affiliate,
      errors: formatZodErrors(result.error),
      membershipTypes,
    })
  }

  try {
    await AffiliateModel.update(id, result.data, scopeUserId)
    res.redirect(`/affiliates/${id}`)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const affiliate = await AffiliateModel.getById(id, scopeUserId)
      if (!affiliate) return notFoundAffiliate(res)
      return res.render('affiliates/edit', {
        affiliate,
        errors: { email: 'Este email ya está registrado' },
        membershipTypes,
      })
    }
    return notFoundAffiliate(res)
  }
}

export const deactivateAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundAffiliate(res)

  try {
    await AffiliateModel.softDelete(id, scopeUserId)
    res.redirect('/affiliates')
  } catch {
    return notFoundAffiliate(res)
  }
}

export const activateAffiliateAction = async (req: Request, res: Response) => {
  const { scopeUserId } = affiliateScope(req)
  const id = parseRouteId(req.params.id)
  if (id === null) return notFoundAffiliate(res)

  try {
    await AffiliateModel.activate(id, scopeUserId)
    res.redirect('/affiliates')
  } catch {
    return notFoundAffiliate(res)
  }
}

