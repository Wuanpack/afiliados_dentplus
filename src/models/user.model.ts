import prisma from '../lib/prisma'

// Recupera todos los usuarios - Función para el admin
export const getAllUsers = async () => {
    return await prisma.user.findMany()
}

export const findByEmail = (email: string) =>
    prisma.user.findUnique({ where: { email }})

export const create = (data: { email: string; password: string }) =>
    prisma.user.create({ data })

// softDelete - Cambia el status (boolean) a false
export const softDelete = async (id: number) => {
    return await prisma.user.update({ 
        where: { id }, 
        data: { status: false } 
    })
}
// activate - Cambia el status (boolean) a true
export const activate = async (id: number) => {
    return await prisma.user.update({ 
        where: { id }, 
        data: { status: true } 
    })
}