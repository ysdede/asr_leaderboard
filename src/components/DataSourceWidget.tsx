import { createSignal, createEffect, Show, For } from 'solid-js'
import type { MetricRow } from '../utils/csv'

const DEFAULT_OWNER = 'ysdede'
const DEFAULT_REPO = 'asr_benchmark_store'
const DEFAULT_BRANCH = 'main'

export interface DataSourceConfig {
  owner: string
  repo: string
  branch: string
}

interface DataSourceWidgetProps {
  currentSource: DataSourceConfig
  isFetching: boolean
  onFetch: (config: DataSourceConfig) => void
}

export function buildCsvUrl(config: DataSourceConfig): string {
  return `https://huggingface.co/datasets/${config.owner}/${config.repo}/resolve/${config.branch}/metrics-00.csv`
}

export function defaultConfig(): DataSourceConfig {
  try {
    const stored = localStorage.getItem('leaderboardDataSource')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.owner && parsed.repo && parsed.branch) return parsed
    }
  } catch { /* ignore */ }
  return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH }
}

export function saveConfig(config: DataSourceConfig) {
  localStorage.setItem('leaderboardDataSource', JSON.stringify(config))
}

async function fetchBranches(owner: string, repo: string): Promise<string[]> {
  const url = `https://huggingface.co/api/datasets/${owner}/${repo}/refs`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return (data.branches || []).map((b: { name: string }) => b.name)
}

export default function DataSourceWidget(props: DataSourceWidgetProps) {
  const [open, setOpen] = createSignal(false)
  const [draft, setDraft] = createSignal<DataSourceConfig>({ ...props.currentSource })
  const [branches, setBranches] = createSignal<string[]>([])
  const [branchesLoading, setBranchesLoading] = createSignal(false)

  function loadBranches() {
    const d = draft()
    setBranchesLoading(true)
    fetchBranches(d.owner, d.repo)
      .then((list) => setBranches(list))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false))
  }

  createEffect(() => {
    if (open()) loadBranches()
  })

  function apply() {
    const config = draft()
    saveConfig(config)
    setOpen(false)
    props.onFetch(config)
  }

  function reset() {
    const dflt = { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH }
    setDraft(dflt)
    saveConfig(dflt)
    setOpen(false)
    props.onFetch(dflt)
  }

  return (
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      <div class="text-xs text-gray-400 dark:text-gray-500 mb-1">
        Data:{' '}
        <span class="font-mono">
          {props.currentSource.owner}/{props.currentSource.repo}@{props.currentSource.branch}
        </span>
        <button
          onClick={() => { setOpen((o) => !o); setDraft({ ...props.currentSource }) }}
          class="ml-2 text-blue-500 hover:text-blue-400 underline"
        >
          {open() ? 'close' : 'change'}
        </button>
      </div>

      <Show when={open()}>
        <div class="mb-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 mr-1">HF Dataset:</span>

            <input
              type="text"
              value={draft().owner}
              onInput={(e) => setDraft((d) => ({ ...d, owner: e.currentTarget.value }))}
              class="px-2 py-1 w-28 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="owner"
            />

            <span class="text-gray-400">/</span>

            <input
              type="text"
              value={draft().repo}
              onInput={(e) => setDraft((d) => ({ ...d, repo: e.currentTarget.value }))}
              class="px-2 py-1 w-44 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="repo"
            />

            <span class="text-gray-400">@</span>

            <Show
              when={branches().length > 0 && !branchesLoading()}
              fallback={
                <>
                  {branchesLoading() ? (
                    <span class="text-xs text-gray-400 animate-pulse">loading branches...</span>
                  ) : (
                    <input
                      type="text"
                      value={draft().branch}
                      onInput={(e) => setDraft((d) => ({ ...d, branch: e.currentTarget.value }))}
                      class="px-2 py-1 w-20 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="branch"
                    />
                  )}
                </>
              }
            >
              <select
                value={draft().branch}
                onChange={(e) => setDraft((d) => ({ ...d, branch: e.currentTarget.value }))}
                class="px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <For each={branches()}>{(b) => <option value={b}>{b}</option>}</For>
              </select>
            </Show>

            <button
              onClick={apply}
              disabled={props.isFetching}
              class="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {props.isFetching ? 'Loading...' : 'Apply'}
            </button>

            <button
              onClick={reset}
              disabled={props.isFetching}
              class="px-3 py-1 text-xs rounded text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Reset
            </button>

            <button
              onClick={loadBranches}
              disabled={branchesLoading() || props.isFetching}
              class="px-2 py-1 text-xs rounded text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
              title="Refresh branch list"
            >
              ⟳
            </button>
          </div>

          <div class="mt-1 text-xs text-gray-400">
            Fetches from:{' '}
            <code class="text-gray-500 break-all">{buildCsvUrl(draft())}</code>
          </div>
        </div>
      </Show>
    </div>
  )
}
