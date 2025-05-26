import { PrismaClient } from '@prisma/client'
import { Spread } from '@/domain/spread'
const prisma = new PrismaClient()

const saveSpread = async (s: Spread) =>
  prisma.spreadRecord.create({ data: s })

const getLastSpread = async (market: string) =>
  prisma.spreadRecord.findFirst({
    where: { market },
    orderBy: { recordedAt: 'desc' }
})

const getSpreads = async (market: string) =>
  prisma.spreadRecord.findMany({
    where: { market },
    orderBy: { recordedAt: 'desc' }
})

const getActiveSpreadsForMarket = async (market: string) =>
  prisma.spreadRecord.findMany({
    where: { active: true, market },
    orderBy: { recordedAt: 'desc' }
  })

const getSpreadById = async (id: number) =>
  prisma.spreadRecord.findUnique({
    where: { id }
  })

const updateSpreadStatus = async (id: number, active: boolean) => {
  const record = prisma.spreadRecord.update({
    where: { id },
    data: { active }
  })
  return record
}

export default {
  saveSpread,
  getLastSpread,
  getSpreads,
  getSpreadById,
  updateSpreadStatus,
  getActiveSpreadsForMarket
}