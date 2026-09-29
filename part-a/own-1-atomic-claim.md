# Part A1.1: Atomic Worker Job Claim (`claimPendingJob`)

## Source Code Reference (from Task 2: `background-jobs/src/worker.ts`)
```typescript
async function claimPendingJob(prisma: PrismaClient): Promise<Job null |> {
  const jobs: Job[] = await prisma.$queryRaw`
    UPDATE "Job"
    SET status = 'processing', "startedAt" = NOW()
    WHERE id = (
      SELECT id FROM "Job"
      WHERE status = 'pending' AND "runAt" <= NOW()
      ORDER BY "runAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *;
  `;
  return jobs[0] ?? null;
}