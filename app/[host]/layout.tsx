import prisma from "@/utils/prisma";
import { notFound } from "next/navigation";

export default async function HostLayout({
  params,
  children,
}: {
  params: { host: string, slug: string | string[] | undefined };
  children: React.ReactNode;
}) {

  const host = decodeURIComponent(params.host);

  const data = await prisma.restaurants.findUnique({
    where: {
      customHost: host
    }})

  if (!data) {
    notFound()
  }

  return (
    <>
      {children}
    </>
  );
}
