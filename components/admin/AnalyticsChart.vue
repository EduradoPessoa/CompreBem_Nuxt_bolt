<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">{{ title }}</h3>
      <select
        v-model="selectedPeriod"
        class="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
    </div>
    <div class="h-64">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  title: string
  data: Array<{ date: string; value: number }>
}>()

const selectedPeriod = ref('30')

const chartData = computed(() => ({
  labels: props.data.map(item => new Date(item.date).toLocaleDateString()),
  datasets: [
    {
      label: props.title,
      data: props.data.map(item => item.value),
      borderColor: '#0ea5e9',
      tension: 0.4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>