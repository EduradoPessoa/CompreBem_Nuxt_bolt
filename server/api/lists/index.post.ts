import { db } from '../../database/connection'
import { shoppingLists, items } from '../../database/schema'
import { shoppingListSchema } from '../../utils/validation'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)
  
  const result = shoppingListSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input'
    })
  }

  const { name, items: listItems = [] } = result.data
  const listId = nanoid()
  const now = new Date()

  await db.transaction(async (tx) => {
    await tx.insert(shoppingLists).values({
      id: listId,
      userId: user.id,
      name,
      createdAt: now,
      updatedAt: now
    })

    if (listItems.length > 0) {
      await tx.insert(items).values(
        listItems.map(item => ({
          id: nanoid(),
          listId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          barcode: item.barcode,
          createdAt: now
        }))
      )
    }
  })

  return { success: true, id: listId }
})