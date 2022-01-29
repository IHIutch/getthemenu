import { createStripeCustomer } from '@/controllers/stripe'
import { apiPostRegisterUser } from '@/controllers/users'
import supabase from '@/utils/supabase'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { session, payload } = req.body

        const stripeCustomer = await createStripeCustomer({
          email: session.user.email,
          name: payload.fullName,
        })

        await apiPostRegisterUser({
          id: session.user.id,
          stripeCustomerId: stripeCustomer.id,
          ...payload,
        })

        return supabase.auth.api.setAuthCookie(req, res)
      } catch (error) {
        return res
          .status(resStatusType.BAD_REQUEST)
          .json({ error: error.message })
      }

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
