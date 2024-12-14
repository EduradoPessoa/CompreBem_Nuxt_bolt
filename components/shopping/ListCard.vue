<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ list.name }}</h3>
      <div class="flex items-center gap-2">
        <Button variant="ghost" @click="$emit('edit', list)">
          <Icon name="heroicons:pencil" class="w-4 h-4" />
        </Button>
        <Button variant="ghost" @click="$emit('delete', list.id)">
          <Icon name="heroicons:trash" class="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
    
    <div class="space-y-2">
      <div v-for="item in list.items" :key="item.id" class="flex items-center justify-between">
        <span class="text-gray-700 dark:text-gray-300">{{ item.name }}</span>
        <span class="text-gray-500 dark:text-gray-400">{{ item.quantity }}x</span>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Total Items:</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ list.items?.length || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShoppingList } from '~/types'

defineProps<{
  list: ShoppingList
}>()

defineEmits<{
  edit: [list: ShoppingList]
  delete: [id: string]
}>()
</script>