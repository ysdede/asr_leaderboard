import { createSignal, Show, onMount, batch } from 'solid-js'
import type { MetricRow } from './utils/csv'
import { parseCSV } from './utils/csv'
import Leaderboard from './components/Leaderboard'
import DataSourceWidget, { buildCsvUrl, defaultConfig, saveConfig, type DataSourceConfig } from './components/DataSourceWidget'

let fetchCsv: typeof import('./utils/csv')['parseCSV'] | null = null

export default function App() {
  const [metrics, setMetrics] = createSignal<MetricRow[] | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [ready, setReady] = createSignal(false)
  const [fetching, setFetching] = createSignal(false)
  const [source, setSource] = createSignal<DataSourceConfig>(defaultConfig())

  async function load(url: string) {
    const r = await fetch(url)
    if (!r.ok) throw Error(`HTTP ${r.status}`)
    return parseCSV(await r.text())
  }

  onMount(() => {
    load(buildCsvUrl(defaultConfig()))
      .then(data => batch(() => { setMetrics(data); setReady(true) }))
      .catch(e => batch(() => { setError(e.message); setReady(true) }))
  })

  async function onChange(config: DataSourceConfig) {
    batch(() => { setError(null); setFetching(true); setSource(config); saveConfig(config) })
    try { setMetrics(await load(buildCsvUrl(config))) }
    catch (e: any) { batch(() => { setError(e.message); setMetrics(null) }) }
    finally { setFetching(false) }
  }

  return (
    <main class="flex min-h-screen flex-col p-2 sm:p-4">
      <Show
        when={ready() && metrics() && metrics()!.length > 0}
        fallback={
          <div class="flex items-center justify-center h-screen">
            <div class="text-center p-4">
              <Show when={error()} fallback={
                <div><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-lg">Loading benchmark data...</p></div>
              }>
                <div><p class="text-lg text-red-600 dark:text-red-400">{error()}</p>
                <button onClick={() => onChange(defaultConfig())} class="mt-4 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Reset</button></div>
              </Show>
            </div>
          </div>
        }
      >
        <DataSourceWidget currentSource={source()} isFetching={fetching()} onFetch={onChange} />
        <Show when={fetching()}>
          <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p class="text-sm">Fetching from {buildCsvUrl(source())}...</p>
            </div>
          </div>
        </Show>
        <Leaderboard metrics={metrics()!} />
      </Show>
    </main>
  )
}
