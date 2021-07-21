import {
  apiDeleteMenuItem,
  apiGetMenuItem,
  apiPutMenuItem,
} from '@/controllers/menuItems'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.body
        const data = await apiGetMenuItem(id)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Update
    case 'PUT':
      try {
        const { id, title, price, description } = req.body
        const data = await apiPutMenuItem(id, {
          title,
          price,
          description,
        })
        res.status(resStatusType.SUCCESS).json(data[0])
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.body
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

export default handler
