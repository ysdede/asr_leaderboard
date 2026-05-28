import { createAsync } from '@solidjs/router'
import { Suspense } from 'solid-js'
import { parseCSV, type MetricRow } from '../utils/csv'
import Leaderboard from '../components/Leaderboard'
import '../css/tailwind.css'

const CSV_URL = 'https://huggingface.co/datasets/ysdede/asr_benchmark_store/resolve/dev/metrics-00.csv'

function fetchMetrics(): Promise<MetricRow[]> {
  return fetch(CSV_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`)
      return r.text()
    })
    .then((csv) => parseCSV(csv))
    .catch(() => [] as MetricRow[])
}

export default function Home() {
  const metrics = createAsync(fetchMetrics)

  return (
    <main class="flex min-h-screen flex-col p-2 sm:p-4">
      <Suspense
        fallback={
          <div class="flex items-center justify-center h-screen">
            <div class="text-center p-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-lg">Loading benchmark data...</p>
            </div>
          </div>
        }
      >
        {() => {
          const data = metrics()
          if (!data || data.length === 0) {
            return (
              <div class="flex items-center justify-center h-screen">
                <div class="text-center p-4">
                  <p class="text-lg">No benchmark data available</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Unable to load ASR benchmark results. Please try again later.
                  </p>
                </div>
              </div>
            )
          }
          return <Leaderboard metrics={data} />
        }}
      </Suspense>
    </main>
  )
}
