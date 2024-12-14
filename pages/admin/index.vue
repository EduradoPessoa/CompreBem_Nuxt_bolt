<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">{{ $t('admin.dashboard') }}</h1>
      <Button variant="primary" @click="showReportGenerator = true">
        {{ $t('admin.generateReport') }}
      </Button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Stats Cards -->
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</h3>
        <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
        <div class="mt-4">
          <div class="text-sm">
            <span :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Charts -->
    <div class="grid gap-6 mt-8 lg:grid-cols-2">
      <AnalyticsChart
        title="User Signups"
        :data="analytics.signups"
      />
      <AnalyticsChart
        title="Daily Active Users"
        :data="analytics.activeUsers"
      />
    </div>

    <!-- Users Table -->
    <div class="mt-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h2 class="text-lg font-medium">{{ $t('admin.users') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(user.createdAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" @click="toggleUserStatus(user.id)">
                    {{ user.active ? $t('admin.deactivate') : $t('admin.activate') }}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Report Generator Modal -->
    <Modal v-model="showReportGenerator">
      <template #title>
        {{ $t('admin.generateReport') }}
      </template>
      <ReportGenerator />
    </Modal>
  </div>
</template>

<script setup lang="ts">
const showReportGenerator = ref(false)
const analytics = ref({
  signups: [],
  activeUsers: []
})

// ... rest of the existing script setup ...

const fetchAnalytics = async () => {
  try {
    const response = await $fetch('/api/admin/analytics/users')
    analytics.value = response
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  }
}

onMounted(() => {
  fetchStats()
  fetchUsers()
  fetchAnalytics()
})
</script>