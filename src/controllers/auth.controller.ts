/// <reference path="../types/session.d.ts" />
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import * as UserModel from '../models/user.model'
import { loginSchema, registerSchema } from '../schemas/auth.schemas'
import { BCRYPT_ROUNDS } from '../lib/constants'
import { formatZodErrors } from '../lib/parseError'
import { isUniqueConstraintError } from '../lib/prismaErrors'

export const loginForm = (_req: Request, res: Response) => {
  res.render('auth/login')
}

export const loginAction = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('auth/login', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })
  }

  const { email, password } = result.data
  const user = await UserModel.findByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('auth/login', {
      error: 'Credenciales incorrectas',
      values: req.body,
    })
  }

  if (!user.status) {
    return res.render('auth/login', {
      error: 'Tu cuenta está desactivada. Contacta al administrador.',
      values: req.body,
    })
  }

  req.session.userId = user.id
  req.session.role = user.role
  req.session.save((err) => {
    if (err) return res.render('auth/login', { error: 'Error al iniciar sesión' })
    res.redirect('/affiliates')
  })
}

export const registerForm = (_req: Request, res: Response) => {
  res.render('auth/register')
}

export const registerAction = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    return res.render('auth/register', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })
  }

  const { email, password } = result.data
  const existing = await UserModel.findByEmail(email)

  if (existing) {
    return res.render('auth/register', {
      error: 'Este email ya está registrado',
      values: req.body,
    })
  }

  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = await UserModel.create({ email, password: hash })
    req.session.userId = user.id
    req.session.role = user.role
    req.session.save((err) => {
      if (err) return res.render('auth/login', { error: 'Error al iniciar sesión' })
      res.redirect('/affiliates')
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.render('auth/register', {
        error: 'Este email ya está registrado',
        values: req.body,
      })
    }
    throw error
  }
}

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect('/login'))
}
