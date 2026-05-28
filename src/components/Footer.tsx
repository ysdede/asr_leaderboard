import { getMaxTimestamp } from '../utils/csv'
import type { MetricRow } from '../utils/csv'

interface FooterProps {
  metrics: MetricRow[]
}

export default function Footer(props: FooterProps) {
  return (
    <footer class="mt-8 border-t pt-2 dark:border-gray-700">
      <div class="max-w-7xl mx-auto p-2 sm:p-4">
        <div class="text-xs dark:text-gray-400 text-gray-600 dark:bg-gray-900 bg-white p-3 rounded-lg shadow-md mb-6">
          <p class="text-xs dark:text-gray-500 text-gray-500">
            Last updated: {getMaxTimestamp(props.metrics)}
          </p>
        </div>

        <div class="rounded-lg overflow-hidden dark:bg-gray-800 bg-white shadow">
          <div class="p-4">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div class="flex-1">
                <h2 class="text-lg font-semibold dark:text-gray-200 text-gray-700 mb-2">
                  About ASR Leaderboard
                </h2>
                <p class="text-sm dark:text-gray-300 text-gray-600 mb-2">
                  A dynamic and interactive leaderboard for Automatic Speech Recognition (ASR) models.
                  This project automatically fetches benchmark results from Hugging Face datasets,
                  parses the data, and presents it in an organized, sortable table format.
                </p>
                <p class="text-sm dark:text-gray-300 text-gray-600">
                  While the current implementation focuses on Turkish ASR models, this project is designed
                  to be universal and can be easily adapted for other languages and datasets.
                </p>
              </div>
              <div class="mt-4 md:mt-0 md:ml-6 flex flex-col items-start">
                <a
                  href="https://github.com/ysdede/asr_leaderboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md dark:bg-gray-700 bg-gray-100 dark:hover:bg-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  Star on GitHub
                </a>
                <div class="text-xs dark:text-gray-400 text-gray-500 mt-2">
                  Adapt this project for your language!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
