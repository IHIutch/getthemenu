import { prismaPutSections } from '@/utils/prisma/sections'
import { resStatusType } from '@/utils/apiResponseTypes'
import { wrapApiHandlerWithSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Update
    case 'PUT':
      try {
        const data = await prismaPutSections(req.body)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default wrapApiHandlerWithSentry(handler)
