/// <reference types="node" />
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient ({ adapter })

async function main() {
    console.log('Seeding database...')

    await prisma.affiliate.deleteMany()
    await prisma.membershipType.deleteMany()
    await prisma.user.deleteMany()

    const hash = await bcrypt.hash('123456', 10)

    const users = await Promise.all([
        prisma.user.create({ data: { email: 'alice@example.com', password: hash, role: 'USER'}}),
        prisma.user.create({ data: { email: 'bob@example.com', password: hash, role: 'ADMIN'}}),
    ])

    const count_users = await prisma.user.count()
    console.log(`Inserted ${count_users} afilliates.`)

    const membershipTypes = await Promise.all([
        prisma.membershipType.create({ data: {name: 'silver', discount: 0.05}}),
        prisma.membershipType.create({ data: {name: 'gold', discount: 0.10}}),
        prisma.membershipType.create({ data: {name: 'platinum', discount: 0.20}})
    ])

    const count_membership = await prisma.membershipType.count()
    console.log(`Inserted ${count_membership} afilliates.`)

    const afiliados = [
        { first_name: 'Juan', last_name: 'Pérez', email: 'juan@example.com', userId: users[0].id, membershipTypeId: membershipTypes[0].id },
        { first_name: 'María', last_name: 'González', email: 'maria@example.com', userId: users[0].id, membershipTypeId: membershipTypes[1].id },
        { first_name: 'Carlos', last_name: 'López', email: 'carlos@example.com', userId: users[1].id, membershipTypeId: membershipTypes[0].id },
        { first_name: 'Ana', last_name: 'Martínez', email: 'ana@example.com', userId: users[1].id, membershipTypeId: membershipTypes[2].id },
        { first_name: 'Pedro', last_name: 'Sánchez', email: 'pedro@example.com', userId: users[0].id, membershipTypeId: membershipTypes[1].id },
    ]

    await prisma.affiliate.createMany({ data: afiliados })

    const count_afiliados = await prisma.affiliate.count()
    console.log(`Inserted ${count_afiliados} afilliates.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })