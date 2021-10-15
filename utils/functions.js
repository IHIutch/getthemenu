import { encode } from 'blurhash'
import dayjs from 'dayjs'

export const handleStructuredData = ({ restaurant, menus }) => {
  return {
    '@context': 'http://schema.org',
    '@type': 'Restaurant',
    url: 'http://www.thisisarestaurant.com',
    name: restaurant.title,
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
  console.log('time', input.value, value)
  return input.value !== value
}

export const isDateInputSupported = () => {
  if (typeof window == 'undefined') return false

  var input = document.createElement('input')
  var value = 'a'
  input.setAttribute('type', 'date')
  input.setAttribute('value', value)
  console.log('date', input.value, value)
  return input.value !== value
}

export const blurhashEncode = async (image) => {
  const imageUrl = URL.createObjectURL(image)
  const loadImage = async (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (...args) => reject(args)
      img.src = src
    })

  const getClampedSize = (width, height, max) => {
    if (width >= height && width > max) {
      return { width: max, height: Math.round((height / width) * max) }
    }

    if (height > width && height > max) {
      return { width: Math.round((width / height) * max), height: max }
    }

    return { width, height }
  }

  const getImageData = (image, resolutionX, resolutionY) => {
    const canvas = document.createElement('canvas')
    canvas.width = resolutionX
    canvas.height = resolutionY
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, resolutionX, resolutionY)
    return context.getImageData(0, 0, resolutionX, resolutionY)
  }

  const img = await loadImage(imageUrl)
  const clampedSize = getClampedSize(img.width, img.height, 64)
  const imageData = getImageData(img, clampedSize.width, clampedSize.height)
  const blurhash = encode(
    imageData.data,
    imageData.width,
    imageData.height,
    4,
    4
  )
  return blurhash
}
