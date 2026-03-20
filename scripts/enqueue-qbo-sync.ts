import { prisma } from '@/lib/prisma'
import { enqueueQboSync } from '@/lib/queue/qbo'

async function main() {
  const clients = await prisma.client.findMany({
    where: { isActive: true },
    select: { id: true, lastSyncAt: true },
  })

  const runType: 'incremental' = 'incremental'

  let enqueued = 0
  for (const c of clients) {
    // Even for clients without lastSyncAt, incrementalSync will fall back to initialSync.
    await enqueueQboSync({ clientId: c.id, type: runType })
    enqueued += 1
  }

  console.log(`Enqueued ${enqueued} QBO sync job(s).`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

