export interface User {
  id: string
  email: string
  name: string
}

export interface ShoppingList {
  id?: string
  name: string
  items?: ShoppingItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ShoppingItem {
  id?: string
  name: string
  quantity: number
  price?: number
  barcode?: string
}