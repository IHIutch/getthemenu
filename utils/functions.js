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
