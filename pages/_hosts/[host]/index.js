import React from 'react'
import MenuView from '@/components/views/MenuView'

export default function Home({ host }) {
  return <MenuView host={host} />
}

export async function getServerSideProps({ params: { host } }) {
  return {
    props: {
      host,
    },
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
