import {
  prismaDeleteMenuItem,
  prismaGetMenuItem,
  prismaPutMenuItem,
} from '@/utils/prisma/menuItems'
import { resStatusType } from '@/utils/apiResponseTypes'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.query
        const data = await prismaGetMenuItem({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Update
    case 'PUT':
      try {
        const { id } = req.query
        const payload = req.body
        const data = await prismaPutMenuItem({ id }, payload)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.query
        const data = await prismaDeleteMenuItem({ id })
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
