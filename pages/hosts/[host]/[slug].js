import MenuView from '@/components/views/MenuView'
import React from 'react'

export default function RestaurantMenu({ host }) {
  return <MenuView host={host} />
}

export async function getServerSideProps(context) {
  // console.log('getServerSideProps', context)
  const host =
    context.params.host !== 'getthemenu.io' &&
    context.params.host !== 'localhost'
      ? context.params.host.split('.')[0]
      : // : ''
        'hello'

  console.log({ host })

  return {
    props: {
      host,
    },
    // revalidate: 10,
  }
}
