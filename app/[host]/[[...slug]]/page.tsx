import * as React from 'react'
import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation';
import { MenuItemSchema, MenuSchema, RestaurantSchema, SectionSchema } from '@/utils/zod';
import { z } from 'zod';
import { getErrorMessage, getStructuredData } from '@/utils/functions';
import { Metadata } from 'next';
import { env } from '@/utils/env';

export default async function MenuPage({
  params,
}: {
  params: { host: string; slug: string | string[] | undefined };
}) {

  const host = decodeURIComponent(params.host);
  const slug = decodeURIComponent(params.slug?.toString() || '');

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host
    },
    include: {
      menuItems: {
        orderBy: {
          position: 'asc'
        }
      },
      menus: {
        orderBy: {
          position: 'asc'
        }
      },
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!data) {
    notFound()
  }

  const activeMenu = slug ? data.menus.find(m => m.slug === slug) : data.menus.shift()

  if (!activeMenu) {
    notFound()
  }

  const menu = MenuSchema.parse(activeMenu)
  const sections = z.array(SectionSchema).parse(data.sections.filter(s => s.menuId === menu?.id))
  const menuItems = z.array(MenuItemSchema).parse(data.menuItems.filter(mi => mi.menuId === menu?.id))

  const result = RestaurantSchema.pick({
    name: true,
    hours: true,
    address: true,
    phone: true,
    email: true,
    coverImage: true,
    customHost: true,
    customDomain: true,
  }).extend({
    menus: z.array(MenuSchema).optional(),
    sections: z.array(SectionSchema).optional(),
    menuItems: z.array(MenuItemSchema).optional()
  }).safeParse(data)

  if (!result.success) {
    throw Error(getErrorMessage(result.error))
  }

  const ldJson = getStructuredData(result.data)

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        suppressHydrationWarning
        />
    <div>
      <pre>
      {JSON.stringify({
        menu, sections, menuItems
      }, null, 2)}
      </pre>
    </div>
      </>
  )
}

export async function generateMetadata({ params }: { params: { host: string, slug: string | string[] | undefined } }): Promise<Metadata | null> {
  const host = decodeURIComponent(params.host);
  const slug = decodeURIComponent(params.slug?.toString() || '');

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host
    },
    include: {
      menuItems: {
        orderBy: {
          position: 'asc'
        }
      },
      menus: {
        orderBy: {
          position: 'asc'
        }
      },
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!data) {
    return null;
  }
  const result = RestaurantSchema.pick({
    name: true,
    hours: true,
    address: true,
    phone: true,
    email: true,
    coverImage: true,
    customHost: true,
    customDomain: true,
  }).safeParse(data)

  if (!result.success) {
    return null
  }

  const { name: title, coverImage: image } = result.data
  const menu = MenuSchema.parse(slug ? data.menus.find(m => m.slug === slug) : data.menus.shift())

  return {
    metadataBase: new URL(`https://${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`),
    title,
    openGraph: {
      title: title || '',
      images: [image?.src || ''],
    },
    twitter: {
      card: "summary_large_image",
      title: title || '',
      images: [image?.src || ''],
    },
    alternates: {
      canonical: `https://${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/${menu.slug}`
    }
  }
}
