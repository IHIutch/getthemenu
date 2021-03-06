import { apiGetRestaurants, apiPostRestaurant } from '@/controllers/restaurants'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await apiGetRestaurants(req.query)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    // Create
    case 'POST':
      try {
        const { payload } = req.body
        const data = await apiPostRestaurant(payload)
        res.status(resStatusType.SUCCESS).json(data[0])
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
