import prisma from '../lib/prisma'
import type { Prisma } from '../generated/prisma/client'

// getAll para los usuarios normales - solo sus afiliados
export const getAll = async (userId: number) => {
    return await prisma.affiliate.findMany({ where: { userId }})
}

// getAll para obtener todos los afiliados en cuenta admin
export const getAllAdmin = async () => {
    return await prisma.affiliate.findMany({ include: {user: true, membershipType: true}})
}

// getById - Sirve para usuarios normales
export const getById = async (id: number, userId: number) => {
    return await prisma.affiliate.findFirst({ where: {id, userId }})
}

// getById - Sirve para admin
export const getByIdAdmin = async (id: number) => {
    return await prisma.affiliate.findFirst({ where: { id } })
}

// create - Crear un afiliado - Sirve para admin y usuarios normales
export const create = async (data: Prisma.AffiliateUncheckedCreateInput) => {
    return await prisma.affiliate.create( {data} )
}

// update - Modificar un afiliado - Sirve para admin y usuarios normales
export const update = async (id: number, userId: number, data: Omit<Prisma.AffiliateUncheckedCreateInput, 'userId'>) => {
    return await prisma.affiliate.update({ where: { id, userId }, data})
}

// softDelete - Cambia el status (boolean) a false - Sirve para admin y usuarios normales
export const softDelete = async (id: number, userId: number) => {
    return await prisma.affiliate.update({ 
        where: { id, userId }, 
        data: { status: false } 
    })
}
// activate - Cambia el status (boolean) a true - Sirve para admin y usuarios normales
export const activate = async (id: number, userId: number) => {
    return await prisma.affiliate.update({ 
        where: { id, userId }, 
        data: { status: true } 
    })
}