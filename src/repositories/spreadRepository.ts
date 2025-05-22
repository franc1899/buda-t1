import { PrismaClient } from '@prisma/client'
import { Spread } from '@/domain/spread'
const prisma = new PrismaClient()

export const saveSpread = async (s: Spread) =>
  prisma.spreadRecord.create({ data: s })

export const getLastSpread = async (market: string) =>
  prisma.spreadRecord.findFirst({
    where: { market },
    orderBy: { recordedAt: 'desc' }
})
