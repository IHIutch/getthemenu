import {
  apiDeleteMenuItem,
  apiGetMenuItem,
  apiPutMenuItem,
} from '@/controllers/menuItems'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.query
        const data = await apiGetMenuItem(id)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Update
    case 'PUT':
      try {
        const { id } = req.query
        const payload = req.body
        const data = await apiPutMenuItem(id, payload)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.query
        const data = await apiDeleteMenuItem(id)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
