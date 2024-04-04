import * as React from 'react'
import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation';
import { MenuItemSchema, MenuSchema, SectionSchema } from '@/utils/zod';
import { z } from 'zod';

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

  return (
    <div>
      <pre>
      {JSON.stringify({
        menu, sections, menuItems
      }, null, 2)}
      </pre>
    </div>
  )
}
