<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
          BuyWell
        </NuxtLink>
        
        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <template v-if="!isAuthenticated">
            <NuxtLink to="/login" class="btn btn-ghost">
              {{ $t('login') }}
            </NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary">
              {{ $t('register') }}
            </NuxtLink>
          </template>
          <UserMenu v-else />
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} BuyWell. {{ $t('allRightsReserved') }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const isAuthenticated = ref(false) // Will be replaced with actual auth logic
</script>