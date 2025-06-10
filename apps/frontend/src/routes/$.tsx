import { notFound, useLoaderData } from '@tanstack/react-router'

import { BlurImage } from '~/components/blur-image'

// const getMenu = createServerFn({ method: 'GET' })
//   .validator((slug: string | undefined) => ({ slug }))
//   .handler(async ({ data }) => {
//     const tenant = await getTenant()

//     const menu = await prisma.menus.findFirst({
//       where: {
//         slug: data.slug,
//         restaurants: {
//           customHost: tenant,
//         },
//       },
//       include: {
//         sections: {
//           orderBy: {
//             position: 'asc',
//           },
//           omit: {
//             restaurantId: true,
//             createdAt: true,
//             updatedAt: true,
//             deletedAt: true,
//           },
//           include: {
//             menuItems: {
//               orderBy: {
//                 position: 'asc',
//               },
//               omit: {
//                 restaurantId: true,
//                 createdAt: true,
//                 updatedAt: true,
//                 deletedAt: true,
//               },
//               include: {
//                 image: {
//                   select: {
//                     url: true,
//                     blurDataUrl: true,
//                     height: true,
//                     width: true,
//                     hex: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         position: 'asc',
//       },
//       omit: {
//         restaurantId: true,
//         createdAt: true,
//         updatedAt: true,
//         deletedAt: true,
//       },
//     })

//     return menu
//   })

export const Route = createFileRoute({
  component: RouteComponent,
  params: {
    stringify: (params: { slug?: string }) => {
      return {
        _splat: params.slug,
      }
    },
    parse: ({ _splat }) => {
      const slug = _splat?.split('/')[0] || ''
      if (slug === '') {
        return {
          slug: undefined,
        }
      }
      return {
        slug,
      }
    },
  },

  loader: async ({ params, parentMatchPromise }) => {
    const slug = params.slug
    const parentMatch = await parentMatchPromise
    const restaurant = parentMatch.loaderData?.restaurant

    if (!restaurant) {
      throw notFound()
    }

    const menu = restaurant.menus.find(m => m.slug === slug) || restaurant.menus[0]

    return {
      menu,
      restaurant,
    }
  },
  head: ({ loaderData }) => {
    const menu = loaderData?.menu
    const restaurant = loaderData?.restaurant

    return {
      meta: [
        menu?.title
          ? {
              ...{ title: `${menu.title} - ${restaurant?.name}` },
              ...{ name: 'og:title', content: `${menu.title} - ${restaurant?.name}` },
            }
          : undefined,
        menu?.description
          ? {
              ...{ name: 'description', content: menu.description },
              ...{ name: 'og:description', content: menu.description },
            }
          : undefined,
      ],
    }
  },
})

function RouteComponent() {
  const slug = Route.useParams()
  const menu = useLoaderData({
    from: '__root__',
    select: ({ restaurant }) => {
      return restaurant.menus.find(m => m.slug === slug.slug) || restaurant.menus[0]
    },
  })

  // const menu = restaurant.menus.find(m => m.slug === slug.slug) || restaurant.menus[0]

  return (
    <div className="pb-12 pt-8">
      {menu.sections.map(s => (
        <div key={s.id}>
          <div className="mb-6">
            <h3 className="text-3xl font-semibold mb-1">{s.title}</h3>
            <p className="text-lg text-slate-600">{s.description}</p>
          </div>
          <div className="space-y-4">
            {s.menuItems.map(menuItem => (
              <div key={menuItem.id} className="rounded-lg border bg-white shadow overflow-hidden">
                {/* <img loading="lazy" fetchPriority="low" src={menuItem.image?.[0]?.url} alt="" className="size-full object-cover"
                                    style={{
                                        aspectRatio:
                                            `${menuItem.image?.[0]?.width || 1}/${menuItem.image?.[0]?.height || 1}`,
                                        backgroundColor: menuItem.image?.[0]?.hex || '#f3f4f6'
                                    }}
                                /> */}
                {menuItem.image?.[0]
                  ? (
                      <BlurImage
                        blurDataUrl={menuItem.image[0].blurDataUrl || undefined}
                        className="aspect-[16/9] overflow-hidden"
                        img={(
                          <img
                            loading="lazy"
                            src={menuItem.image[0].url}
                            alt=""
                            className="size-full object-cover"
                          />
                        )}
                      />
                    )
                  : null}
                <div className="p-4 flex">
                  <div className="grow">
                    <p className="text-lg font-semibold mb-0.5">{menuItem.title}</p>
                    <p className="text-slate-500">{menuItem.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">
                      {menuItem.price?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
