import { getErrorMessage, getStructuredData } from "@/utils/functions";
import prisma from "@/utils/prisma";
import { MenuItemSchema, MenuSchema, RestaurantSchema, SectionSchema } from "@/utils/zod";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { env } from "@/utils/env";

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

export default async function HostLayout({
  params,
  children,
}: {
  params: { host: string, slug: string | string[] | undefined };
  children: React.ReactNode;
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
      {children}
    </>
  );
}
