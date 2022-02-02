import dayjs from 'dayjs'
import supabase from '@/utils/supabase'

export const handleStructuredData = ({ restaurant, menus }) => {
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
    hasMenu: menus.map((menu) => ({
      '@type': 'Menu',
      name: menu.title,
      // description: "Menu for in-restaurant dining only.",
      hasMenuSection: menu.sections.map((section) => ({
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
          .filter((i) => i.sectionId === section._id)
          .map((item) => ({
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

export const formatDate = (val, format = 'MM/DD/YYYY') => {
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

export const getPublicURL = (path) => {
  try {
    const { publicURL, error } = supabase.storage
      .from('public')
      .getPublicUrl(path)
    if (error) throw error
    return publicURL
  } catch (err) {
    console.log('Error downloading file: ', err.message)
  }
}

export const reorderList = (list = [], startIndex, endIndex) => {
  const temp = [...list]
  const [removed] = temp.splice(startIndex, 1)
  temp.splice(endIndex, 0, removed)
  return temp
}

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  return dayjs()
    .startOf('year')
    .add(hours, 'hour')
    .add(minutes, 'minute')
    .format('h:mm A')
}
