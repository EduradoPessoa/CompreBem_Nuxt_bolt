import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const shoppingLists = sqliteTable('shopping_lists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  listId: text('list_id').notNull().references(() => shoppingLists.id),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price'),
  barcode: text('barcode'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})