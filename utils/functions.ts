import type { DraggableLocation } from 'react-beautiful-dnd'
import dayjs from 'dayjs'
import { unstable_cache } from 'next/cache'
import { z } from 'zod'
import prisma from './prisma'
import { createClientComponent } from './supabase/component'
import { MenuItemSchema, MenuSchema, RestaurantSchema, SectionSchema } from './zod'

const _StructuredDataSchema = RestaurantSchema.omit({
  id: true,
  userId: true,
  customHost: true,
  customDomain: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  menus: z.array(MenuSchema.omit({
    restaurantId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })),
  sections: z.array(SectionSchema.omit({
    restaurantId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })),
  menuItems: z.array(MenuItemSchema.omit({
    restaurantId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })),
})

type StructuredDataType = z.infer<typeof _StructuredDataSchema>

export function getStructuredData(restaurant: StructuredDataType) {
  const minPrice = Math.min(
    ...(restaurant.menuItems || []).map(mi => mi?.price || 0),
  ).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const maxPrice = Math.max(
    ...(restaurant.menuItems || []).map(mi => mi?.price || 0),
  ).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return {
    '@context': 'http://schema.org',
    '@type': 'Restaurant',
    'url': 'http://www.thisisarestaurant.com',
    'name': restaurant.name || '',
    'image': restaurant.coverImage?.src || '',
    'telephone': restaurant.phone?.[0] || '',
    'priceRange': `${minPrice} - ${maxPrice}`,
    'description': 'a description of this business',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': restaurant.address?.streetAddress || '',
      'addressLocality': restaurant.address?.city || '',
      'addressRegion': restaurant.address?.state || '',
      'postalCode': restaurant.address?.zip || '',
    },
    'servesCuisine': ['American cuisine'],
    'hasMenu': (restaurant?.menus || []).map((menu: any) => ({
      '@type': 'Menu',
      'name': menu.title || '',
      // description: "Menu for in-restaurant dining only.",
      'hasMenuSection': (restaurant?.sections || [])
        .filter(section => section.menuId === menu.id)
        .map(section => ({
          '@type': 'MenuSection',
          'name': section.title || '',
          // description: "Appetizers and such",
          // image: "https://thisisarestaurant.com/starter_dishes.jpg",
          // offers: {
          //   "@type": "Offer",
          //   availabilityEnds: "T8:22:00",
          //   availabilityStarts: "T8:22:00",
          // },
          'hasMenuItem': (restaurant?.menuItems || [])
            .filter(item => item.sectionId === section.id)
            .map(item => ({
              '@type': 'MenuItem',
              'name': item.title || '',
              'description': item.description || '',
              'offers': {
                '@type': 'Offer',
                'price': item.price,
                'priceCurrency': 'USD',
              },
              // suitableForDiet: "http://schema.org/GlutenFreeDiet",
            })),
        })),
    })),
  }
}

export function formatDate(val: Date, format = 'MM/DD/YYYY') {
  return dayjs(val).format(format)
}

export function isTimeInputSupported() {
  if (typeof window == 'undefined')
    return false

  const input = document.createElement('input')
  const value = 'a'
  input.setAttribute('type', 'time')
  input.setAttribute('value', value)
  // console.log('time', input.value, value)
  return input.value !== value
}

export function isDateInputSupported() {
  if (typeof window == 'undefined')
    return false

  const input = document.createElement('input')
  const value = 'a'
  input.setAttribute('type', 'date')
  input.setAttribute('value', value)
  // console.log('date', input.value, value)
  return input.value !== value
}

export function getPublicURL(path: string) {
  try {
    const supabase = createClientComponent()
    const { data: publicUrl } = supabase.storage
      .from('public')
      .getPublicUrl(path)
    if (!publicUrl)
      throw new Error('Image not found')
    return publicUrl
  }
  catch (error) {
    console.log('Error downloading file: ', getErrorMessage(error))
  }
}

// export const reorderList = (list: any[], startIndex: number, endIndex: number) => {
//   const temp = [...list]
//   const [removed] = temp.splice(startIndex, 1)
//   temp.splice(endIndex, 0, removed)
//   return temp
// }

export function reorderList<Value>(list: Value[], startIndex: number, finishIndex: number) {
  if (startIndex === -1 || finishIndex === -1) {
    return list
  }

  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)

  if (removed)
    result.splice(finishIndex, 0, removed)

  return result
}

export function move<Value>(sourceList: Value[], destinationList: Value[], source: DraggableLocation, destination: DraggableLocation) {
  const resultSource = Array.from(sourceList)
  const resultDestination = Array.from(destinationList)

  const [removed] = resultSource.splice(source.index, 1)
  if (removed)
    resultDestination.splice(destination.index, 0, removed)

  return {
    resultSource,
    resultDestination,
  }
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  return dayjs()
    .startOf('year')
    .add(Number(hours), 'hour')
    .add(Number(minutes), 'minute')
    .format('h:mm A')
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error)
    return error.message
  return String(error)
}

export const getRestaurantDisplayData = unstable_cache(async (host: string) => {
  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host,
    },
    select: {
      name: true,
      address: true,
      hours: true,
      coverImage: true,
      menuItems: {
        select: {
          id: true,
          menuId: true,
          sectionId: true,
          title: true,
          price: true,
          description: true,
          position: true,
          image: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
      menus: {
        select: {
          id: true,
          title: true,
          slug: true,
          position: true,
          description: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
      sections: {
        select: {
          id: true,
          menuId: true,
          title: true,
          position: true,
          description: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!data) {
    return null
  }

  const result = RestaurantSchema.omit({
    id: true,
    userId: true,
    customHost: true,
    customDomain: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).extend({
    menus: z.array(MenuSchema.omit({
      restaurantId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    })),
    sections: z.array(SectionSchema.omit({
      restaurantId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    })),
    menuItems: z.array(MenuItemSchema.omit({
      restaurantId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    })),
  }).safeParse(data)

  if (!result.success) {
    throw new Error(getErrorMessage(result.error))
  }

  return result.data
})
