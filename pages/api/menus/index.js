import { apiGetMenus, apiPostMenu } from '@/controllers/menus'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await apiGetMenus(req.query)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error)
      }
      break

    // Create
    case 'POST':
      try {
        const payload = req.body
        const data = await apiPostMenu(payload)
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
