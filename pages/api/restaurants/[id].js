import {
  prismaDeleteRestaurant,
  prismaGetRestaurant,
  prismaPutRestaurant,
} from '@/utils/prisma/restaurants'
import { resStatusType } from '@/utils/apiResponseTypes'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.query
        const data = await prismaGetRestaurant({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Update
    case 'PUT':
      try {
        const { id } = req.query
        const data = await prismaPutRestaurant({ id }, req.body)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.query
        const data = prismaDeleteRestaurant({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
