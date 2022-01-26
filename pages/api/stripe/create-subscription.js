import { createStripeSubscription } from '@/controllers/stripe'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { customerId, priceId } = req.body
        const stripeSubscription = await createStripeSubscription({
          customerId,
          priceId,
        })
        res.status(resStatusType.SUCCESS).json({
          clientSecret:
            stripeSubscription.latest_invoice.payment_intent.client_secret,
        })
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json(error.message)
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
