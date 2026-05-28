const DATASET_NAMES = {
  turkishvoicedataset: 'Turkish Voice Dataset',
  MediaSpeech: 'MediaSpeech',
  commonvoice_17_tr_fixed: 'Common Voice 17 TR',
  'ys-0': 'Yeni Split 0',
  'ys-0-lq': 'Yeni Split 0 (Low Quality)',
}

export function friendlyDatasetName(name: string): string {
  return (DATASET_NAMES as Record<string, string>)[name] || name
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let inQuotes = false
  let current = ''

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export interface MetricRow {
  asr_model_name: string
  wer: string
  cer: string
  cosine_similarity: string
  speed: string
  dataset_name: string
  dataset_hf_id: string
  device_model: string
  timestamp: string
  asr_model_url: string
  backend: string
  device: string
}

export function parseCSV(csvText: string): MetricRow[] {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0])
  // Dedup: keep latest run per model+dataset by timestamp
  const latestByKey = new Map<string, MetricRow>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCsvLine(line)
    if (values.length !== headers.length) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx]
    })

    const key = `${row.asr_model_name}|${row.dataset_name}`
    const existing = latestByKey.get(key)
    if (!existing || row.timestamp > existing.timestamp) {
      latestByKey.set(key, row as unknown as MetricRow)
    }
  }

  return Array.from(latestByKey.values())
}

export function formatNumber(value: string | number | undefined): string {
  if (!value) return '-'
  const num = parseFloat(String(value))
  return isNaN(num) ? String(value) : num.toFixed(2)
}

export function formatTimestamp(ts: string): string {
  if (!ts || ts.length < 14) return 'Unknown'
  const formatted = `${ts.substring(0, 4)}-${ts.substring(4, 6)}-${ts.substring(6, 8)} ${ts.substring(8, 10)}:${ts.substring(10, 12)}:${ts.substring(12, 14)}`
  return new Date(formatted).toLocaleString()
}

export function getMaxTimestamp(rows: MetricRow[]): string {
  if (!rows.length) return 'Unknown'
  const maxTs = rows.reduce((max, r) => (r.timestamp > max ? r.timestamp : max), rows[0].timestamp)
  return formatTimestamp(maxTs)
}
