import { prismaPostFeedback } from '@/utils/prisma/feedback'
import { resStatusType } from '@/utils/apiResponseTypes'
import { wrapApiHandlerWithSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Create
    case 'POST':
      try {
        const data = await prismaPostFeedback(req.body)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default wrapApiHandlerWithSentry(handler)
