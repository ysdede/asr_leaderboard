/// <reference types="vite/client" />
import { createSignal, Show } from 'solid-js'
import type { MetricRow } from './utils/csv'
import { parseCSV } from './utils/csv'
import Leaderboard from './components/Leaderboard'
import DataSourceWidget, { buildCsvUrl, defaultConfig, saveConfig, type DataSourceConfig } from './components/DataSourceWidget'

declare global { interface Window { __LEADERBOARD_DATA__?: MetricRow[] } }

function loadInitial(): MetricRow[] | null {
  if (window.__LEADERBOARD_DATA__?.length) return window.__LEADERBOARD_DATA__!
  return null
}

export default function App() {
  const initial = loadInitial()
  const [metrics, setMetrics] = createSignal<MetricRow[] | null>(initial)
  const [ready, setReady] = createSignal(initial !== null)
  const [error, setError] = createSignal<string | null>(null)
  const [fetching, setFetching] = createSignal(false)
  const [source, setSource] = createSignal<DataSourceConfig>(defaultConfig())

  if (!initial) {
    fetch(buildCsvUrl(defaultConfig()))
      .then(r => { if (!r.ok) throw Error(`HTTP ${r.status}`); return r.text() })
      .then(csv => { setMetrics(parseCSV(csv)); setReady(true) })
      .catch(e => { setError(e.message); setReady(true) })
  }

  async function onChange(config: DataSourceConfig) {
    setError(null); setFetching(true); setSource(config); saveConfig(config)
    try {
      const r = await fetch(buildCsvUrl(config))
      if (!r.ok) throw Error(`HTTP ${r.status}`)
      setMetrics(parseCSV(await r.text()))
    } catch (e: any) { setError(e.message); setMetrics(null) }
    finally { setFetching(false) }
  }

  const data = () => metrics()

  return (
    <main class="flex min-h-screen flex-col p-2 sm:p-4">
      <Show
        when={ready() && data() && data()!.length > 0}
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
        <Leaderboard metrics={data()!} />
      </Show>
    </main>
  )
}
