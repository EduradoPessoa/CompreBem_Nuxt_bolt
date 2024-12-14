<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700',
      variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
      variant === 'ghost' && 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}>()
</script>