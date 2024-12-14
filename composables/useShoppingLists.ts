import { defineStore } from 'pinia'
import type { ShoppingList } from '~/types'

export const useShoppingLists = defineStore('shoppingLists', {
  state: () => ({
    lists: [] as ShoppingList[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchLists() {
      this.loading = true
      this.error = null
      
      try {
        this.lists = await $fetch('/api/lists')
      } catch (error) {
        this.error = 'Failed to fetch shopping lists'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async createList(list: ShoppingList) {
      try {
        await $fetch('/api/lists', {
          method: 'POST',
          body: list
        })
        await this.fetchLists()
      } catch (error) {
        console.error('Failed to create list:', error)
        throw error
      }
    },

    async updateList(list: ShoppingList) {
      try {
        await $fetch(`/api/lists/${list.id}`, {
          method: 'PUT',
          body: list
        })
        await this.fetchLists()
      } catch (error) {
        console.error('Failed to update list:', error)
        throw error
      }
    },

    async deleteList(id: string) {
      try {
        await $fetch(`/api/lists/${id}`, {
          method: 'DELETE'
        })
        await this.fetchLists()
      } catch (error) {
        console.error('Failed to delete list:', error)
        throw error
      }
    }
  }
})