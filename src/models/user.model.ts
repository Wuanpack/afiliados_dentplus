import prisma from '../lib/prisma'

const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} as const

export const getAllUsers = () =>
  prisma.user.findMany({
    select: userPublicSelect,
    orderBy: { id: 'asc' },
  })

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } })

export const create = (data: { email: string; password: string }) =>
  prisma.user.create({ data })

export const softDelete = (id: number) =>
  prisma.user.update({
    where: { id },
    data: { status: false },
  })

export const activate = (id: number) =>
  prisma.user.update({
    where: { id },
    data: { status: true },
  })
