import { createSignal, createMemo, For } from 'solid-js'
import type { MetricRow } from '../utils/csv'
import { formatNumber, friendlyDatasetName } from '../utils/csv'
import SortHeader from './SortHeader'
import ThemeToggle from './ThemeToggle'

interface AverageTableProps {
  metrics: MetricRow[]
}

export default function AverageTable(props: AverageTableProps) {
  const datasets = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.dataset_name))
    return Array.from(set).sort()
  })

  const [selectedDatasets, setSelectedDatasets] = createSignal<string[]>([])
  const [sortKey, setSortKey] = createSignal('avgWer')
  const [sortDir, setSortDir] = createSignal('asc')

  function toggleDataset(name: string) {
    setSelectedDatasets((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    )
  }

  function selectAll() {
    setSelectedDatasets([...datasets()])
  }

  function clearAll() {
    setSelectedDatasets([])
  }

  function handleSort(key: string) {
    if (sortKey() === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      if (key === 'avgWer' || key === 'avgCer') setSortDir('asc')
      else setSortDir('desc')
    }
  }

  const averageMetrics = createMemo(() => {
    const active = selectedDatasets()
    const useDatasets = active.length > 0 ? active : datasets()
    const groups = new Map<string, { name: string; url: string; rows: MetricRow[] }>()

    for (const item of props.metrics) {
      if (!useDatasets.includes(item.dataset_name)) continue
      const existing = groups.get(item.asr_model_name)
      if (existing) {
        existing.rows.push(item)
      } else {
        groups.set(item.asr_model_name, {
          name: item.asr_model_name,
          url: item.asr_model_url,
          rows: [item],
        })
      }
    }

    return Array.from(groups.values()).map((g) => {
      const count = g.rows.length
      if (count === 0) return null
      const sums = g.rows.reduce(
        (acc, r) => ({
          wer: acc.wer + (parseFloat(r.wer) || 0),
          cer: acc.cer + (parseFloat(r.cer) || 0),
          sim: acc.sim + (parseFloat(r.cosine_similarity) || 0),
          speed: acc.speed + (parseFloat(r.speed) || 0),
        }),
        { wer: 0, cer: 0, sim: 0, speed: 0 }
      )
      return {
        name: g.name,
        url: g.url,
        avgWer: (sums.wer / count).toFixed(2),
        avgCer: (sums.cer / count).toFixed(2),
        avgSim: (sums.sim / count).toFixed(2),
        avgSpeed: (sums.speed / count).toFixed(2),
        datasetCount: count,
        includedDatasets: [...new Set(g.rows.map((r) => r.dataset_name))].map(friendlyDatasetName).join(', '),
      }
    }).filter(Boolean) as NonNullable<ReturnType<typeof Array.prototype.map>[number]>[]
  })

  const sortedAvg = createMemo(() => {
    const key = sortKey() as string
    const dir = sortDir()
    const mult = dir === 'asc' ? 1 : -1
    return [...averageMetrics()].sort((a, b) => {
      const aVal = parseFloat((a as Record<string, string>)[key]) || 0
      const bVal = parseFloat((b as Record<string, string>)[key]) || 0
      return (aVal - bVal) * mult
    })
  })

  return (
    <div class="max-w-7xl mx-auto p-2 sm:p-4 w-full">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h1 class="text-lg sm:text-xl font-bold dark:text-gray-100 text-gray-800">
          Turkish ASR Leaderboard
        </h1>
        <ThemeToggle />
      </div>

      {/* Dataset selector */}
      <div class="mb-4 dark:bg-gray-900 bg-white rounded-lg shadow-md p-3">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="text-xs font-medium dark:text-gray-300 text-gray-700">Select datasets:</span>
          <div class="flex gap-2">
            <button
              onClick={selectAll}
              class="px-2 py-0.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              All
            </button>
            <button
              onClick={clearAll}
              class="px-2 py-0.5 text-xs rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 border dark:border-gray-700 border-gray-200 rounded">
          <For each={datasets()}>
            {(ds) => (
              <label class="inline-flex items-center cursor-pointer text-xs px-1">
                <input
                  type="checkbox"
                  checked={selectedDatasets().includes(ds) || selectedDatasets().length === 0}
                  onChange={() => toggleDataset(ds)}
                  class="h-3 w-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="ml-1 text-xs dark:text-gray-300 text-gray-700">{friendlyDatasetName(ds)}</span>
              </label>
            )}
          </For>
        </div>

        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {selectedDatasets().length === 0
            ? 'Using all datasets for calculation'
            : `Using ${selectedDatasets().length} selected dataset(s) for calculation`}
        </div>
      </div>

      {/* Average scores table */}
      <div class="overflow-x-auto dark:bg-gray-900 bg-white rounded-lg shadow-md -mx-2 sm:mx-0">
        <table class="min-w-full divide-y dark:divide-gray-700 divide-gray-200">
          <thead class="dark:bg-gray-800 bg-gray-50">
            <tr>
              <th class="py-2 px-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Model
              </th>
              <SortHeader label="WER" sortKey="avgWer" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="CER" sortKey="avgCer" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="Similarity" sortKey="avgSim" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="Speed" sortKey="avgSpeed" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <th class="py-2 px-2 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap datasets-col">
                Datasets
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700 divide-gray-200">
            <For each={sortedAvg()}>
              {(item, idx) => (
                <tr class={idx() % 2 === 0 ? 'dark:bg-gray-900 bg-white' : 'dark:bg-gray-800 bg-gray-50'}>
                  <td class="py-2 px-3 text-xs whitespace-nowrap">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                    >
                      {item.name}
                    </a>
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.avgWer)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.avgCer)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.avgSim)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {Math.round(parseFloat(item.avgSpeed))}x
                  </td>
                  <td class="py-2 px-2 text-xs text-left datasets-col">
                    <div class="flex items-center" title={item.includedDatasets}>
                      <span class="font-bold text-xs dark:text-gray-300 text-gray-700 mr-1">
                        {item.datasetCount}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {item.includedDatasets}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-xs dark:text-gray-400 text-gray-600 dark:bg-gray-900 bg-white p-3 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p><span class="font-semibold">Avg WER</span>: Average Word Error Rate (lower is better)</p>
            <p><span class="font-semibold">Avg CER</span>: Average Character Error Rate (lower is better)</p>
          </div>
          <div>
            <p><span class="font-semibold">Avg Similarity</span>: Average Cosine similarity (higher is better)</p>
            <p><span class="font-semibold">Avg Speed</span>: Average Real-time factor (higher is better)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
