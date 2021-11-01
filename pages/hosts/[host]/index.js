import React from 'react'

import MenuView from '@/components/views/MenuView'
import LoginView from '@/components/views/LoginView'

export default function RestaurantHome({ host }) {
  return host ? <MenuView host={host} /> : <LoginView />
}

export async function getServerSideProps(context) {
  const host =
    context.params.host !== 'getthemenu.io' &&
    context.params.host !== 'localhost'
      ? context.params.host.split('.')[0]
      : ''
  // : 'hello'

  return {
    props: {
      host,
    },
    // revalidate: 10,
  }
}

// export async function getStaticPaths() {
//   const restaurants = await apiGetRestaurants()
//   const paths = restaurants.map((restaurant) => ({
//     params: {
//       host: `${restaurant.subdomain}.getthemenu.io`,
//     },
//   }))

//   return {
//     paths,
//     fallback: 'blocking',
//   }
// }
