<template>
  <button
    @click="toggleColorMode"
    class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    aria-label="Toggle theme"
  >
    <Icon
      :name="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
      class="w-5 h-5"
    />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>