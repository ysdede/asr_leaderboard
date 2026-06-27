import { createSignal, createMemo, createEffect, For, Show } from 'solid-js'
import type { MetricRow } from '../utils/csv'
import { formatNumber, friendlyDatasetName } from '../utils/csv'
import SortHeader from './SortHeader'

interface BenchmarkTableProps {
  metrics: MetricRow[]
}

const tableSettingsKey = 'leaderboardTableSettings'

interface TableSettings {
  sortKey: string
  sortDir: string
  selectedDataset: string
  selectedHardware: string
  selectedModel: string
}

function readJson<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : null
  } catch {
    return null
  }
}

function readString(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function loadTableSettings(): TableSettings {
  const saved = readJson<Partial<TableSettings>>(tableSettingsKey)
  const legacySort = readJson<{ key?: string, direction?: string }>('sortConfig')
  const legacyDataset = readString('selectedDataset')

  return {
    sortKey: saved?.sortKey || legacySort?.key || 'wer',
    sortDir: saved?.sortDir || legacySort?.direction || 'asc',
    selectedDataset: saved?.selectedDataset || legacyDataset || 'all',
    selectedHardware: saved?.selectedHardware || 'all',
    selectedModel: saved?.selectedModel || 'all',
  }
}

function saveTableSettings(settings: TableSettings) {
  try {
    localStorage.setItem(tableSettingsKey, JSON.stringify(settings))
    localStorage.setItem('selectedDataset', settings.selectedDataset)
    localStorage.setItem('sortConfig', JSON.stringify({ key: settings.sortKey, direction: settings.sortDir }))
  } catch {
  }
}

export default function BenchmarkTable(props: BenchmarkTableProps) {
  const initialSettings = loadTableSettings()

  const datasets = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.dataset_name))
    return Array.from(set).sort()
  })

  const hardware = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.device_model || 'Unknown'))
    return Array.from(set).sort()
  })

  const models = createMemo(() => {
    const set = new Set(props.metrics.map((m) => m.asr_model_name))
    return Array.from(set).sort()
  })

  const [sortKey, setSortKey] = createSignal(initialSettings.sortKey)
  const [sortDir, setSortDir] = createSignal(initialSettings.sortDir)
  const [selectedDataset, setSelectedDataset] = createSignal(initialSettings.selectedDataset)
  const [selectedHardware, setSelectedHardware] = createSignal(initialSettings.selectedHardware)
  const [selectedModel, setSelectedModel] = createSignal(initialSettings.selectedModel)

  createEffect(() => {
    const dataset = selectedDataset()
    if (dataset !== 'all' && !datasets().includes(dataset)) setSelectedDataset('all')

    const hw = selectedHardware()
    if (hw !== 'all' && !hardware().includes(hw)) setSelectedHardware('all')

    const mdl = selectedModel()
    if (mdl !== 'all' && !models().includes(mdl)) setSelectedModel('all')
  })

  createEffect(() => {
    saveTableSettings({
      sortKey: sortKey(),
      sortDir: sortDir(),
      selectedDataset: selectedDataset(),
      selectedHardware: selectedHardware(),
      selectedModel: selectedModel(),
    })
  })

  function handleSort(key: string) {
    if (sortKey() === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      if (key === 'wer' || key === 'cer') setSortDir('asc')
      else setSortDir('desc')
    }
  }

  const activeFilters = createMemo(() => {
    let count = 0
    if (selectedDataset() !== 'all') count++
    if (selectedHardware() !== 'all') count++
    if (selectedModel() !== 'all') count++
    return count
  })

  function clearFilters() {
    setSelectedDataset('all')
    setSelectedHardware('all')
    setSelectedModel('all')
  }

  const sortedMetrics = createMemo(() => {
    let items = props.metrics

    const ds = selectedDataset()
    if (ds !== 'all') {
      items = items.filter((m) => m.dataset_name === ds)
    }

    const hw = selectedHardware()
    if (hw !== 'all') {
      items = items.filter((m) => m.device_model === hw)
    }

    const mdl = selectedModel()
    if (mdl !== 'all') {
      items = items.filter((m) => m.asr_model_name === mdl)
    }

    const key = sortKey()
    const dir = sortDir()
    const mult = dir === 'asc' ? 1 : -1

    return [...items].sort((a, b) => {
      const aVal = parseFloat(String(a[sortKey() as keyof MetricRow])) || 0
      const bVal = parseFloat(String(b[sortKey() as keyof MetricRow])) || 0
      return (aVal - bVal) * mult
    })
  })

  return (
    <div class="max-w-7xl mx-auto p-2 sm:p-4 w-full">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {models().length} models across {datasets().length} datasets
        <Show when={activeFilters() > 0}>
          <span class="ml-2">
            — {sortedMetrics().length} result{sortedMetrics().length !== 1 ? 's' : ''} matching
            <button
              onClick={clearFilters}
              class="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear filters
            </button>
          </span>
        </Show>
      </p>

      {/* Filters */}
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="text-xs font-medium dark:text-gray-300 text-gray-700">
          Dataset:
          <select
            value={selectedDataset()}
            onChange={(e) => setSelectedDataset(e.currentTarget.value)}
            class="ml-1 text-xs border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="all">All ({props.metrics.length})</option>
            <For each={datasets()}>
              {(ds) => (
                <option value={ds}>
                  {friendlyDatasetName(ds)} ({props.metrics.filter((m) => m.dataset_name === ds).length})
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="text-xs font-medium dark:text-gray-300 text-gray-700">
          Hardware:
          <select
            value={selectedHardware()}
            onChange={(e) => setSelectedHardware(e.currentTarget.value)}
            class="ml-1 text-xs border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="all">All</option>
            <For each={hardware()}>
              {(hw) => (
                <option value={hw}>
                  {hw} ({props.metrics.filter((m) => m.device_model === hw).length})
                </option>
              )}
            </For>
          </select>
        </label>

        <label class="text-xs font-medium dark:text-gray-300 text-gray-700">
          Model:
          <select
            value={selectedModel()}
            onChange={(e) => setSelectedModel(e.currentTarget.value)}
            class="ml-1 text-xs border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 border-gray-300 rounded px-2 py-1 bg-white max-w-[200px]"
          >
            <option value="all">All</option>
            <For each={models()}>
              {(mdl) => (
                <option value={mdl}>
                  {mdl} ({props.metrics.filter((m) => m.asr_model_name === mdl).length})
                </option>
              )}
            </For>
          </select>
        </label>
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
                      href={`https://huggingface.co/datasets/${item.dataset_hf_id}`}
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
