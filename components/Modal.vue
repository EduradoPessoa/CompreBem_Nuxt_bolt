<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="$emit('update:modelValue', false)"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" aria-hidden="true" />
          
          <div
            class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            @click.stop
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium">
                <slot name="title" />
              </h2>
              <button
                @click="$emit('update:modelValue', false)"
                class="text-gray-400 hover:text-gray-500"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </div>
            
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>