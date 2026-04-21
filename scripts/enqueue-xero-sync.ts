import { prisma } from '@/lib/prisma'
import { enqueueXeroSync } from '@/lib/queue/xero'

async function main() {
  const clients = await prisma.client.findMany({
    where: { isActive: true, xeroTenantId: { not: null } },
    select: { id: true, xeroLastSyncAt: true },
  })

  const runType: 'incremental' = 'incremental'

  let enqueued = 0
  for (const c of clients) {
    await enqueueXeroSync({ clientId: c.id, type: runType })
    enqueued += 1
  }

  console.log(`Enqueued ${enqueued} Xero sync job(s).`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
