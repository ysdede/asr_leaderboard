import type { JSX } from 'solid-js'

interface SortHeaderProps {
  label: string
  sortKey: string
  currentKey: string
  direction: string
  onSort: (key: string) => void
}

export default function SortHeader(props: SortHeaderProps) {
  const defaultDir = (key: string) => {
    // WER/CER default asc (lower=better), Similarity/Speed default desc (higher=better)
    if (key === 'wer' || key === 'cer' || key === 'avgWer' || key === 'avgCer') return 'asc'
    return 'desc'
  }

  function handleClick() {
    if (props.currentKey === props.sortKey) {
      props.onSort(props.sortKey)
    } else {
      // New column: start with default direction
      props.onSort(props.sortKey)
    }
  }

  return (
    <th
      class="py-2 px-1 sm:px-2 text-center text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 whitespace-nowrap"
      onClick={handleClick}
    >
      <div class="flex items-center justify-center">
        {props.label}
        {props.currentKey === props.sortKey && (
          <span class="ml-1">{props.direction === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  )
}
