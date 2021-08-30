import { apiPutSections } from '@/controllers/menuItems'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Update
    case 'PUT':
      try {
        const payload = req.body
        const data = await apiPutSections(payload)
        res.status(resStatusType.SUCCESS).json(data[0])
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
