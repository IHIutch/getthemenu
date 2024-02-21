import { resStatusType } from '@/utils/apiResponseTypes'
import { wrapApiHandlerWithSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      //   doSomething()
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default wrapApiHandlerWithSentry(handler)
