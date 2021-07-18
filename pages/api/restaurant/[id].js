import {
  apiDeleteRestaurant,
  apiGetRestaurant,
  apiPutRestaurant,
} from '@/controllers/restaurants'
import { resStatusType } from '@/utils/types'

const handler = async (res, req) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.body
        const data = await apiGetRestaurant(id)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Update
    case 'PUT':
      try {
        const { id, payload } = req.body
        const data = await apiPutRestaurant(id, payload)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.body
        const data = apiDeleteRestaurant(id)
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

export default handler
