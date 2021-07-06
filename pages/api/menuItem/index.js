import { apiGetMenuItems, apiPostMenuItem } from '@/controllers/menuItems'
import { resStatusType } from '@/util/types'

const handler = async (res, req) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await apiGetMenuItems(req.query)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    // Create
    case 'POST':
      try {
        const { payload } = req.body
        const data = await apiPostMenuItem(payload)
        res.status(resStatusType.SUCCESS).json(data[0])
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
