import {
  createStripeCustomer,
  createStripeSubscription,
} from '@/controllers/stripe'
import { apiGetUser, apiPutUser } from '@/controllers/users'
import supabase from '@/utils/supabase'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { priceId } = req.body
        const { user: sessionUser } = await supabase.auth.api.getUserByCookie(
          req
        )

        let user = await apiGetUser(sessionUser.id)

        if (!user.stripeCustomerId) {
          const stripeCustomer = await createStripeCustomer({
            email: sessionUser.email,
          })

          const data = await apiPutUser(user.id, {
            stripeCustomerId: stripeCustomer.id,
          })
          user = data[0]
        }

        const stripeSubscription = await createStripeSubscription({
          customerId: user.stripeCustomerId,
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
