import { prismaPostUser } from '@/utils/prisma/users'
import { createStripeCustomer } from '@/utils/stripe'
import supabase from '@/utils/supabase'
import { resStatusType } from '@/utils/apiResponseTypes'
import { withSentry } from '@sentry/nextjs'
import dayjs from 'dayjs'

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

        await prismaPostUser({
          id: session.user.id,
          stripeCustomerId: stripeCustomer.id,
          trialEndsAt: dayjs().add(30, 'day').endOf('day').toISOString(),
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
