import { Title, Meta } from '@solidjs/meta'
import type { MetricRow } from '../utils/csv'
import BenchmarkTable from './BenchmarkTable'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'

interface LeaderboardProps {
  metrics: MetricRow[]
}

export default function Leaderboard(props: LeaderboardProps) {
  return (
    <>
      <Title>Turkish ASR Leaderboard — Speech Recognition Benchmarks</Title>
      <Meta name="description" content="Compare Turkish ASR model performance benchmarks. Interactive leaderboard showing WER, CER, similarity and speed metrics across multiple datasets." />
      <Meta name="keywords" content="Turkish ASR, speech recognition, benchmark, leaderboard, WER, CER, whisper, automatic speech recognition, Turkish language" />
      <Meta property="og:title" content="Turkish ASR Leaderboard — Speech Recognition Benchmarks" />
      <Meta property="og:description" content="Compare Turkish ASR model performance benchmarks across multiple datasets. Interactive leaderboard with WER, CER, similarity and speed metrics." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Turkish ASR Leaderboard — Speech Recognition Benchmarks" />
      <Meta name="twitter:description" content="Compare Turkish ASR model performance benchmarks across multiple datasets." />

      <div class="flex flex-col space-y-8 pb-4">
        <div class="max-w-7xl mx-auto p-2 sm:p-4 w-full">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <h1 class="text-lg sm:text-xl font-bold dark:text-gray-100 text-gray-800">
                Turkish ASR Leaderboard
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Compare automatic speech recognition models on Turkish datasets
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <BenchmarkTable metrics={props.metrics} />
        <Footer metrics={props.metrics} />
      </div>
    </>
  )
}
