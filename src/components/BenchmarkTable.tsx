import { createSignal, createMemo, For } from 'solid-js'
import type { MetricRow } from '../utils/csv'
import { formatNumber, friendlyDatasetName } from '../utils/csv'
import SortHeader from './SortHeader'

interface BenchmarkTableProps {
  metrics: MetricRow[]
}

export default function BenchmarkTable(props: BenchmarkTableProps) {
  const datasets = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.dataset_name))
    return Array.from(set).sort()
  })

  const [sortKey, setSortKey] = createSignal('wer')
  const [sortDir, setSortDir] = createSignal('asc')
  const [selectedDataset, setSelectedDataset] = createSignal('all')

  function handleSort(key: string) {
    if (sortKey() === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      if (key === 'wer' || key === 'cer') setSortDir('asc')
      else setSortDir('desc')
    }
  }

  const models = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.asr_model_name))
    return Array.from(set).sort()
  })

  const sortedMetrics = createMemo(() => {
    let items = props.metrics
    const ds = selectedDataset()
    if (ds !== 'all') {
      items = items.filter((m) => m.dataset_name === ds)
    }

    const key = sortKey()
    const dir = sortDir()
    const mult = dir === 'asc' ? 1 : -1

    return [...items].sort((a, b) => {
      const aVal = parseFloat((a as Record<string, string>)[key]) || 0
      const bVal = parseFloat((b as Record<string, string>)[key]) || 0
      return (aVal - bVal) * mult
    })
  })

  return (
    <div class="max-w-7xl mx-auto p-2 sm:p-4 w-full">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {models().length} models compared across {datasets().length} datasets
      </p>

      {/* Dataset filter */}
      <div class="mb-4">
        <label class="text-xs font-medium dark:text-gray-300 text-gray-700 mr-2" for="dataset-select">
          Filter by dataset:
        </label>
        <select
          id="dataset-select"
          value={selectedDataset()}
          onChange={(e) => setSelectedDataset(e.currentTarget.value)}
          class="text-xs border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value="all">All Datasets ({props.metrics.length} results)</option>
          <For each={datasets()}>
            {(ds) => (
              <option value={ds}>
                {friendlyDatasetName(ds)} ({props.metrics.filter((m) => m.dataset_name === ds).length})
              </option>
            )}
          </For>
        </select>
      </div>

      <div class="overflow-x-auto dark:bg-gray-900 bg-white rounded-lg shadow-md -mx-2 sm:mx-0">
        <table class="min-w-full divide-y dark:divide-gray-700 divide-gray-200">
          <thead class="dark:bg-gray-800 bg-gray-50">
            <tr>
              <th class="py-2 px-1 sm:px-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Model
              </th>
              <SortHeader label="WER" sortKey="wer" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="CER" sortKey="cer" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="Similarity" sortKey="cosine_similarity" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <SortHeader label="Speed" sortKey="speed" currentKey={sortKey()} direction={sortDir()} onSort={handleSort} />
              <th class="py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dataset
              </th>
              <th class="hidden sm:table-cell py-2 px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Hardware
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700 divide-gray-200">
            <For each={sortedMetrics()}>
              {(item, idx) => (
                <tr class={idx() % 2 === 0 ? 'dark:bg-gray-900 bg-white' : 'dark:bg-gray-800 bg-gray-50'}>
                  <td class="py-2 px-1 sm:px-3 text-xs whitespace-nowrap">
                    <a
                      href={item.asr_model_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                    >
                      {item.asr_model_name}
                    </a>
                  </td>
                  <td class="py-2 px-1 sm:px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.wer)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.cer)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {formatNumber(item.cosine_similarity)}%
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    {Math.round(parseFloat(item.speed))}x
                  </td>
                  <td class="py-2 px-2 text-xs text-center whitespace-nowrap">
                    <a
                      href={`https://huggingface.co/${item.dataset_hf_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="dark:text-blue-400 text-blue-600 dark:hover:text-blue-300 hover:text-blue-800 hover:underline"
                    >
                      {friendlyDatasetName(item.dataset_name)}
                    </a>
                  </td>
                  <td class="hidden sm:table-cell py-2 px-2 text-xs text-center whitespace-nowrap">
                    {item.device_model || '-'}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  )
}
