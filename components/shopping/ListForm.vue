<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <Input
      v-model="form.name"
      label="List Name"
      :error="errors.name"
      required
    />
    
    <div class="space-y-2">
      <h3 class="text-lg font-medium">Items</h3>
      <div v-for="(item, index) in form.items" :key="index" class="flex gap-2">
        <Input
          v-model="item.name"
          placeholder="Item name"
          class="flex-1"
        />
        <Input
          v-model.number="item.quantity"
          type="number"
          placeholder="Qty"
          class="w-24"
        />
        <Button type="button" variant="ghost" @click="removeItem(index)">
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </Button>
      </div>
    </div>
    
    <Button type="button" variant="secondary" @click="addItem">
      Add Item
    </Button>
    
    <div class="flex justify-end gap-2">
      <Button type="button" variant="ghost" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        {{ list ? 'Update' : 'Create' }} List
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ShoppingList } from '~/types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { shoppingListSchema } from '~/server/utils/validation'

const props = defineProps<{
  list?: ShoppingList
}>()

const emit = defineEmits<{
  submit: [data: ShoppingList]
  cancel: []
}>()

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(shoppingListSchema)
})

const form = reactive({
  name: props.list?.name || '',
  items: props.list?.items || [{ name: '', quantity: 1 }]
})

const addItem = () => {
  form.items.push({ name: '', quantity: 1 })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    ...props.list,
    ...values,
    items: form.items.filter(item => item.name.trim())
  })
  resetForm()
})
</script>