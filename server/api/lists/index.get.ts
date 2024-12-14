import { db } from '../../database/connection'
import { shoppingLists, items } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  const lists = await db.query.shoppingLists.findMany({
    where: eq(shoppingLists.userId, user.id),
    with: {
      items: true
    },
    orderBy: (lists, { desc }) => [desc(lists.createdAt)]
  })

  return lists
})