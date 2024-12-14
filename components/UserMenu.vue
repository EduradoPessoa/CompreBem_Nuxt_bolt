<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span class="text-sm">{{ auth.currentUser?.name }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" />
    </button>
    
    <div
      v-if="isOpen"
      class="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1">
        <NuxtLink
          to="/profile"
          class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ $t('profile') }}
        </NuxtLink>
        <button
          @click="handleLogout"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ $t('logout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const isOpen = ref(false)

const handleLogout = () => {
  auth.logout()
  navigateTo('/login')
}

onClickOutside(isOpen, () => {
  isOpen.value = false
})
</script>