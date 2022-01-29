import prisma from '@/utils/prisma'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const column = Object.keys(req.query)[0]
        if (['customHost', 'customDomain'].includes(column)) {
          const data = await prisma.restaurants.findMany({
            where: {
              [column]: { startsWith: req.query[column] },
              NOT: {
                customHost: 'xyz', // Analytics host (reserved)
              },
            },
            select: {
              [column]: true,
            },
          })
          res.status(resStatusType.SUCCESS).json(data)
        } else {
          throw new Error(`Column ${column} is not allowed`)
        }
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
