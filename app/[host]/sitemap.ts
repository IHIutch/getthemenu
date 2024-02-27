import { env } from "@/utils/env";
import prisma from "@/utils/prisma";
import { MetadataRoute } from "next"
import { headers } from "next/headers";

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();

  const host =
    headersList
      .get("host")
      ?.replace(".localhost:3000", "")
      ?.replace(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host
    },
    include: {
      menus: {
        orderBy: {
          position: 'asc'
        }
      },
    }
  })

  const menus = (data?.menus || []).map((menu) => ({
    url: `${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/${menu.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const
  }))

  return [
    {
      url: `${host}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly'
    },
    ...menus
  ]
}
