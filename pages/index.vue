<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">{{ $t('welcome.title') }}</h1>
      <Button v-if="auth.isAuthenticated" variant="primary" @click="showForm = true">
        {{ $t('createList') }}
      </Button>
    </div>

    <template v-if="auth.isAuthenticated">
      <div v-if="lists.loading" class="text-center py-8">
        <p class="text-gray-500">{{ $t('loading') }}</p>
      </div>
      
      <div v-else-if="lists.error" class="text-center py-8">
        <p class="text-red-500">{{ lists.error }}</p>
      </div>
      
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ListCard
          v-for="list in lists.lists"
          :key="list.id"
          :list="list"
          @edit="editList"
          @delete="deleteList"
        />
      </div>
    </template>
    
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-bold mb-4">{{ $t('welcome.subtitle') }}</h2>
      <div class="flex justify-center gap-4">
        <NuxtLink to="/login" class="btn btn-primary">
          {{ $t('login') }}
        </NuxtLink>
        <NuxtLink to="/register" class="btn btn-secondary">
          {{ $t('register') }}
        </NuxtLink>
      </div>
    </div>

    <Modal v-model="showForm">
      <template #title>
        {{ editingList ? $t('editList') : $t('createList') }}
      </template>
      
      <ListForm
        :list="editingList"
        @submit="handleSubmit"
        @cancel="closeForm"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const lists = useShoppingLists()
const showForm = ref(false)
const editingList = ref<ShoppingList | null>(null)

onMounted(() => {
  if (auth.isAuthenticated) {
    lists.fetchLists()
  }
})

const handleSubmit = async (list: ShoppingList) => {
  try {
    if (editingList.value) {
      await lists.updateList(list)
    } else {
      await lists.createList(list)
    }
    closeForm()
  } catch (error) {
    // Error handling will be done by the store
  }
}

const editList = (list: ShoppingList) => {
  editingList.value = list
  showForm.value = true
}

const deleteList = async (id: string) => {
  if (confirm($t('confirmDelete'))) {
    await lists.deleteList(id)
  }
}

const closeForm = () => {
  showForm.value = false
  editingList.value = null
}
</script>