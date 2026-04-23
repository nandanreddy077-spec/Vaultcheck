/**
 * Run an array of async tasks with a bounded concurrency limit.
 * Avoids both sequential bottlenecks and unconstrained Promise.all that
 * can exhaust the DB connection pool on large syncs.
 */
export async function runConcurrently<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const i = index++
      results[i] = await tasks[i]()
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker)
  await Promise.all(workers)
  return results
}
