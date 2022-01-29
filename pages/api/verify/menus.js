import prisma from '@/utils/prisma'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { restaurantId, slug } = req.body
        const data = await prisma.menus.findMany({
          where: {
            restaurantId,
            slug: {
              startsWith: slug,
            },
          },
          select: {
            slug: true,
          },
        })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error.message)
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
