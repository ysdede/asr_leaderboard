import { createSignal, Show } from 'solid-js'
import type { MetricRow } from '../utils/csv'
import Leaderboard from '../components/Leaderboard'
import DataSourceWidget, {
  buildCsvUrl,
  defaultConfig,
  saveConfig,
  type DataSourceConfig,
} from '../components/DataSourceWidget'
import '../css/tailwind.css'

declare global {
  interface Window { __LEADERBOARD_DATA__?: MetricRow[] }
}

async function fetchMetrics(url: string): Promise<MetricRow[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  const { parseCSV } = await import('../utils/csv')
  return parseCSV(await res.text())
}

export default function Home() {
  const initial = (typeof window !== 'undefined' && window.__LEADERBOARD_DATA__?.length)
    ? window.__LEADERBOARD_DATA__
    : null

  const [metrics, setMetrics] = createSignal<MetricRow[] | null>(initial)
  const [loaded, setLoaded] = createSignal(initial !== null)
  const [clientError, setClientError] = createSignal<string | null>(null)
  const [isFetching, setIsFetching] = createSignal(false)
  const [currentSource, setCurrentSource] = createSignal<DataSourceConfig>(defaultConfig())

  // SSR fallback: if no embedded data, fetch client-side
  if (!initial && typeof window !== 'undefined') {
    fetchMetrics(buildCsvUrl(defaultConfig()))
      .then((data) => { setMetrics(data); setLoaded(true) })
      .catch((e) => { setClientError(e.message); setLoaded(true) })
  }

  function handleSourceChange(config: DataSourceConfig) {
    setClientError(null)
    setIsFetching(true)
    setCurrentSource(config)
    saveConfig(config)
    fetchMetrics(buildCsvUrl(config))
      .then((data) => { setMetrics(data); setLoaded(true); setIsFetching(false) })
      .catch((e) => { setClientError(e.message); setMetrics(null); setIsFetching(false) })
  }

  return (
    <main class="flex min-h-screen flex-col p-2 sm:p-4">
      <Show
        when={loaded() && metrics() && metrics()!.length > 0}
        fallback={
          <div class="flex items-center justify-center h-screen">
            <div class="text-center p-4">
              <Show
                when={clientError()}
                fallback={
                  <div>
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-lg">Loading benchmark data...</p>
                  </div>
                }
              >
                <div>
                  <p class="text-lg text-red-600 dark:text-red-400">{clientError()}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Unable to load from <code>{buildCsvUrl(currentSource())}</code>
                  </p>
                  <button
                    onClick={() => handleSourceChange(defaultConfig())}
                    class="mt-4 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Reset to default source
                  </button>
                </div>
              </Show>
            </div>
          </div>
        }
      >
        <div>
          <DataSourceWidget currentSource={currentSource()} isFetching={isFetching()} onFetch={handleSourceChange} />

          <Show when={isFetching()}>
            <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p class="text-sm">Fetching from {buildCsvUrl(currentSource())}...</p>
              </div>
            </div>
          </Show>

          <Leaderboard metrics={metrics()!} />
        </div>
      </Show>
    </main>
  )
}
