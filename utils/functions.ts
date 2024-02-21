import dayjs from 'dayjs'
import { createClientComponent } from './supabase/component'
import { DraggableLocation } from 'react-beautiful-dnd'

export const handleStructuredData = ({ restaurant, menus }: any) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'Restaurant',
    url: 'http://www.thisisarestaurant.com',
    name: restaurant.name,
    image: restaurant.image,
    telephone: restaurant.phone,
    priceRange: '$100 - $200',
    description: 'a description of this business',
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address.streetAddress,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.state,
      postalCode: restaurant.address.zip,
    },
    servesCuisine: ['American cuisine'],
    hasMenu: menus.map((menu: any) => ({
      '@type': 'Menu',
      name: menu.title,
      // description: "Menu for in-restaurant dining only.",
      hasMenuSection: menu.sections.map((section: any) => ({
        '@type': 'MenuSection',
        name: section.title,
        // description: "Appetizers and such",
        // image: "https://thisisarestaurant.com/starter_dishes.jpg",
        // offers: {
        //   "@type": "Offer",
        //   availabilityEnds: "T8:22:00",
        //   availabilityStarts: "T8:22:00",
        // },
        hasMenuItem: menu.menuItems
          .filter((i: any) => i.sectionId === section._id)
          .map((item: any) => ({
            '@type': 'MenuItem',
            name: item.title,
            description: item.description,
            offers: {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'USD',
            },
            // suitableForDiet: "http://schema.org/GlutenFreeDiet",
          })),
      })),
    })),
  }
}

export const formatDate = (val: Date, format = 'MM/DD/YYYY') => {
  return dayjs(val).format(format)
}

export const isTimeInputSupported = () => {
  if (typeof window == 'undefined') return false

  var input = document.createElement('input')
  var value = 'a'
  input.setAttribute('type', 'time')
  input.setAttribute('value', value)
  // console.log('time', input.value, value)
  return input.value !== value
}

export const isDateInputSupported = () => {
  if (typeof window == 'undefined') return false

  var input = document.createElement('input')
  var value = 'a'
  input.setAttribute('type', 'date')
  input.setAttribute('value', value)
  // console.log('date', input.value, value)
  return input.value !== value
}

export const getPublicURL = (path: string) => {
  try {
    const supabase = createClientComponent()
    const { data: publicUrl } = supabase.storage
      .from('public')
      .getPublicUrl(path)
    if (!publicUrl) throw new Error('Image not found')
    return publicUrl
  } catch (error) {
    console.log('Error downloading file: ', getErrorMessage(error))
  }
}

// export const reorderList = (list: any[], startIndex: number, endIndex: number) => {
//   const temp = [...list]
//   const [removed] = temp.splice(startIndex, 1)
//   temp.splice(endIndex, 0, removed)
//   return temp
// }

export const reorderList = <Value>(
  list: Value[],
  startIndex: number,
  finishIndex: number,
) => {
  if (startIndex === -1 || finishIndex === -1) {
    return list;
  }

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  if (removed) result.splice(finishIndex, 0, removed);

  return result;
}

export const move = <Value>(
  sourceList: Value[],
  destinationList: Value[],
  source: DraggableLocation,
  destination: DraggableLocation
) => {

  const resultSource = Array.from(sourceList);
  const resultDestination = Array.from(destinationList);

  const [removed] = resultSource.splice(source.index, 1);
  if (removed) resultDestination.splice(destination.index, 0, removed);

  return {
    resultSource,
    resultDestination,
  };
};


export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  return dayjs()
    .startOf('year')
    .add(Number(hours), 'hour')
    .add(Number(minutes), 'minute')
    .format('h:mm A')
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
