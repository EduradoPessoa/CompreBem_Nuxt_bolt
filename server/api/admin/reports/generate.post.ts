import { db } from '../../../database/connection'
import { users, shoppingLists, items } from '../../../database/schema'
import { sql } from 'drizzle-orm'
import { createObjectCsvStringifier } from 'csv-writer'

export default defineEventHandler(async (event) => {
  // Check admin permission
  const user = event.context.user
  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  const body = await readBody(event)
  const { startDate, endDate, type } = body

  let data: any[] = []
  let headers: any[] = []

  switch (type) {
    case 'users':
      headers = [
        { id: 'date', title: 'Date' },
        { id: 'signups', title: 'New Signups' },
        { id: 'activeUsers', title: 'Active Users' }
      ]
      
      data = await db.select({
        date: sql<string>`date(u.created_at)`,
        signups: sql<number>`count(distinct u.id)`,
        activeUsers: sql<number>`count(distinct sl.user_id)`
      })
      .from(users as any)
      .leftJoin(shoppingLists as any, sql`date(u.created_at) = date(sl.created_at)`)
      .where(sql`u.created_at between ${startDate} and ${endDate}`)
      .groupBy(sql`date(u.created_at)`)
      .orderBy(sql`date(u.created_at)`)
      break

    case 'lists':
      headers = [
        { id: 'date', title: 'Date' },
        { id: 'totalLists', title: 'Total Lists' },
        { id: 'avgItems', title: 'Average Items per List' }
      ]
      
      data = await db.select({
        date: sql<string>`date(sl.created_at)`,
        totalLists: sql<number>`count(distinct sl.id)`,
        avgItems: sql<number>`avg(select count(*) from ${items} where list_id = sl.id)`
      })
      .from(shoppingLists as any)
      .where(sql`sl.created_at between ${startDate} and ${endDate}`)
      .groupBy(sql`date(sl.created_at)`)
      .orderBy(sql`date(sl.created_at)`)
      break

    case 'items':
      headers = [
        { id: 'name', title: 'Item Name' },
        { id: 'frequency', title: 'Frequency' },
        { id: 'avgPrice', title: 'Average Price' }
      ]
      
      data = await db.select({
        name: items.name,
        frequency: sql<number>`count(*)`,
        avgPrice: sql<number>`avg(price)`
      })
      .from(items)
      .where(sql`created_at between ${startDate} and ${endDate}`)
      .groupBy(items.name)
      .orderBy(sql`count(*)`, 'desc')
      .limit(100)
      break
  }

  // Generate CSV
  const csvStringifier = createObjectCsvStringifier({
    header: headers,
    fieldDelimiter: ','
  })

  const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data)
  
  // Set response headers for CSV download
  setHeaders(event, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename=report-${type}-${startDate}.csv`
  })

  return csvString
})