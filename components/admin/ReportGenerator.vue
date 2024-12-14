<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-medium mb-4">{{ $t('admin.generateReport') }}</h3>
    
    <form @submit.prevent="generateReport" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ $t('admin.startDate') }}</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{ $t('admin.endDate') }}</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
          >
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">{{ $t('admin.reportType') }}</label>
        <select
          v-model="reportType"
          class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="users">{{ $t('admin.userActivity') }}</option>
          <option value="lists">{{ $t('admin.listActivity') }}</option>
          <option value="items">{{ $t('admin.itemAnalysis') }}</option>
        </select>
      </div>
      
      <div class="flex justify-end">
        <Button type="submit" variant="primary" :disabled="loading">
          {{ loading ? $t('admin.generating') : $t('admin.generate') }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const startDate = ref('')
const endDate = ref('')
const reportType = ref('users')
const loading = ref(false)

const generateReport = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/reports/generate', {
      method: 'POST',
      body: {
        startDate: startDate.value,
        endDate: endDate.value,
        type: reportType.value
      }
    })
    
    // Download the report
    const blob = new Blob([response], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportType.value}-${startDate.value}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to generate report:', error)
  } finally {
    loading.value = false
  }
}
</script>