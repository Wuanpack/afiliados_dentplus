import prisma from '../lib/prisma'

export const getAll = () =>
  prisma.membershipType.findMany({ orderBy: { id: 'asc' } })
