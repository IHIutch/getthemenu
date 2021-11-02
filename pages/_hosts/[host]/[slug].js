import MenuView from '@/components/views/MenuView'
import React from 'react'

export default function RestaurantMenu({ host, slug }) {
  return <MenuView host={host} slug={slug} />
}

export async function getServerSideProps({ params: { host, slug } }) {
  return {
    props: {
      host,
      slug,
    },
  }
}
