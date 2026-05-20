import prisma from '../lib/prisma'
import type { Prisma } from '../generated/prisma/client'

const affiliateInclude = {
    membershipType: true,
    user: true,
} as const

function affiliateWhere (id: number, userId?: number) {
    return userId !== undefined ? { id, userId }: {id}
}

function listWhere (userId?: number) {
    return userId !== undefined ? { userId }: {}
}

export const getAll = (userId?: number) =>
    prisma.affiliate.findMany({
        where: listWhere(userId),
        include: affiliateInclude,
    })

export const getById = (id: number, userId?: number) =>
    prisma.affiliate.findFirst({
        where: affiliateWhere(id, userId),
        include: { membershipType: true }
    })

export const create = async (data: Prisma.AffiliateUncheckedCreateInput) => {
    return await prisma.affiliate.create( {data} )
}

export const update = (
    id: number,
    data: Omit<Prisma.AffiliateUncheckedCreateInput, 'userId'>,
    userId?: number,
) => 
    prisma.affiliate.update({
        where: affiliateWhere(id, userId),
        data,
    })

export const setStatus = (id: number, status:boolean, userId?: number) =>
    prisma.affiliate.update({
        where: affiliateWhere(id, userId),
        data: {status },
    })

export const softDelete = (id:number, userId?: number) =>
    setStatus(id, false, userId)

export const activate = (id:number, userId?: number) =>
    setStatus(id, true, userId)

