import { Request } from 'express'

/** ADMIN: sin filtro por userId. USER: solo sus afiliados. */
export function affiliateScope(req: Request) {
  const { userId, role } = req.session
  const isAdmin = role === 'ADMIN'
  return {
    isAdmin,
    scopeUserId: isAdmin ? undefined : userId!,
  }
}
