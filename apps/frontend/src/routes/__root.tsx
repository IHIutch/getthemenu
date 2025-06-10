import { prisma } from '@repo/db'
import {
  createRootRoute,
  HeadContent,
  Link,
  notFound,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { getRequestURL } from '@tanstack/react-start/server'
import dayjs from 'dayjs'
import * as React from 'react'
import { parse } from 'tldts'
import { z } from 'zod'

import { BlurImage } from '~/components/blur-image'
import { formatTime } from '~/utils/format-time'

import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary'
import { NotFound } from '../components/NotFound'
import stylesHref from '../styles.css?url'

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

const weekdayName = dayjs().format('dddd') as typeof DAYS_OF_WEEK[number]

export const getTenant = createServerFn({ method: 'GET' }).handler(() => {
  const url = getRequestURL()
  const parsedUrl = parse(url.toString())

  return parsedUrl.domain?.endsWith('localhost')
    ? parsedUrl.domainWithoutSuffix
    : parsedUrl.subdomain
})

const getRestaurant = createServerFn({ method: 'GET' }).handler(async () => {
  const tenant = await getTenant()

  if (!tenant) {
    throw notFound()
  }

  const restaurant = await prisma.restaurants.findUnique({
    where: {
      customHost: tenant,
    },
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    include: {
      coverImage: {
        select: {
          url: true,
          blurDataUrl: true,
          height: true,
          width: true,
          hex: true,
        },
      },
      menus: {
        orderBy: {
          position: 'asc',
        },
        omit: {
          restaurantId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        include: {
          sections: {
            orderBy: {
              position: 'asc',
            },
            omit: {
              restaurantId: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
            include: {
              menuItems: {
                orderBy: {
                  position: 'asc',
                },
                omit: {
                  restaurantId: true,
                  createdAt: true,
                  updatedAt: true,
                  deletedAt: true,
                },
                include: {
                  image: {
                    select: {
                      url: true,
                      blurDataUrl: true,
                      height: true,
                      width: true,
                      hex: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!restaurant) {
    throw notFound()
  }

  return {
    ...restaurant,
    address: z.object({
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }).parse(restaurant.address),
    phone: z.array(z.string()).parse(restaurant.phone),
    email: z.array(z.string()).parse(restaurant.email),
    hours: z.record(z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })).parse(restaurant.hours),
  }
})

export const Route = createRootRoute({

  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  loader: async () => {
    const restaurant = await getRestaurant()

    if (!restaurant) {
      throw notFound()
    }

    return {
      restaurant,
    }
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  head: ({ loaderData }) => {
    const restaurant = loaderData?.restaurant
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        restaurant?.name
          ? {
              ...{ title: restaurant.name },
              ...{ name: 'og:title', content: restaurant.name },
            }
          : undefined,
      ],
      links: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: stylesHref },
      ],
    }
  },
})

function RootComponent() {
  const { restaurant: data } = Route.useLoaderData()

  return (
    <RootDocument>
      <div className="aspect-[16/9] sm:aspect-[21/9] relative flex flex-col">
        {data?.coverImage.length > 0
          ? (
              <div className="absolute size-full z-0">
                {/* <img loading="eager" fetchPriority="high" src={data.coverImage[0].url} alt="" className='overflow-hidden size-full object-cover'
                            style={{
                                backgroundImage: `url(${data.coverImage[0].blurDataUrl})`,
                                backgroundSize: 'cover',
                            }}
                        /> */}
                <BlurImage
                  blurDataUrl={data.coverImage[0].blurDataUrl || undefined}
                  className="overflow-hidden size-full"
                  img={(
                    <img
                      src={data.coverImage[0].url}
                      alt=""
                      className="size-full object-cover"
                      fetchPriority="high"
                      loading="eager"
                    />
                  )}
                />
              </div>
            )
          : null}
        <div className="max-w-screen-lg mx-auto z-10 relative mt-auto w-full pb-8 px-4">
          <h1 className="mb-4 text-5xl text-white font-bold [text-shadow:0_2px_1px_black]">{data.name}</h1>
          <div className="flex items-center text-white gap-8">
            {data?.phone?.length > 0
              ? (
                  <div className="flex gap-2">
                    {/* <Icon as={PhoneIcon} /> */}
                    <span>{data?.phone?.[0]}</span>
                  </div>
                )
              : null}

            {data?.phone?.length > 0
              ? (
                  <div className="flex gap-2">
                    {/* <Icon as={PhoneIcon} /> */}
                    {data?.hours?.[weekdayName]?.isOpen
                      ? (
                          <span>
                            {data.hours?.[weekdayName]?.openTime
                              ? formatTime(
                                  data.hours?.[weekdayName]?.openTime || '',
                                )
                              : null}
                            {' '}
                            -
                            {' '}
                            {data.hours?.[weekdayName]?.closeTime
                              ? formatTime(
                                  data.hours?.[weekdayName]?.closeTime || '',
                                )
                              : null}
                          </span>
                        )
                      : (
                          <span>Closed Today</span>
                        )}
                  </div>
                )
              : null}
          </div>
        </div>
      </div>
      <div className="py-8 border-b sticky top-0 bg-slate-50 z-10">
        <div className="max-w-screen-lg mx-auto relative px-4">
          <ul className="flex gap-2">
            {data.menus.map(m => (
              <li key={m.slug}>
                <Link
                  resetScroll={false}
                  to="/$"
                  params={{
                    slug: m.slug,
                  }}
                  className="underline"
                >
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto relative px-4">
        <div className="grid lg:grid-cols-12">
          <div className="col-span-7">
            <Outlet />
          </div>
          <div className="col-span-4 col-start-9 hidden lg:block">
            <div className="space-y-8 sticky top-28 pt-8">
              <div className="rounded-lg border bg-white shadow overflow-hidden">
                <div className="px-4 py-2 border-b">
                  <h2 className="font-semibold text-lg">Contact</h2>
                </div>
                <div className="p-4 text-sm">
                  <dl className="space-y-4">
                    {data?.phone?.length > 0
                      ? (
                          <div>
                            <dt className="font-medium mb-0.5 block">Phone</dt>
                            <dd>
                              <ul className="space-y-1">
                                {data?.phone?.map((p, idx) => (
                                  <li key={idx}>{p}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        )
                      : null}
                    {data.address
                      ? (
                          <div>
                            <dt className="font-medium mb-0.5 block">
                              Address
                            </dt>
                            <dd className="leading-normal">
                              {data.address?.streetAddress}
                              {' '}
                              <br />
                              {data.address?.city}
                              ,
                              {' '}
                              {data.address?.state}
                              {' '}
                              {data.address?.zip}
                            </dd>
                          </div>
                        )
                      : null}
                  </dl>
                </div>
              </div>
              <div className="rounded-lg border bg-white shadow overflow-hidden">
                <div className="px-4 py-2 border-b">
                  <h2 className="font-semibold text-lg">Hours</h2>
                </div>
                <div className="space-y-2.5 p-4">
                  {DAYS_OF_WEEK.map(day => (
                    <dl
                      key={day}
                      className="text-sm flex justify-between"
                    >
                      <div>
                        <dt className="font-medium">
                          {day}
                          :
                        </dt>
                      </div>
                      <div>
                        {data.hours?.[day]?.isOpen
                          ? (
                              <dd>
                                {data.hours?.[day]?.openTime
                                  && formatTime(
                                    data.hours?.[day]?.openTime || '',
                                  )}
                                {' '}
                                -
                                {' '}
                                {data.hours?.[day]?.closeTime
                                  && formatTime(
                                    data.hours?.[day]?.closeTime || '',
                                  )}
                              </dd>
                            )
                          : (
                              <dd>Closed</dd>
                            )}
                      </div>
                    </dl>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
