import Stripe from 'stripe'
import { resStatusType } from '@/utils/apiResponseTypes'
import { buffer } from 'micro'
import { getErrorMessage } from '@/utils/functions'
import { env } from '@/utils/env'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaUpdateUser } from '@/utils/prisma/users'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  const signingSecret = env.STRIPE_SIGNING_SECRET
  const signature = req.headers['stripe-signature']

  const rawBody = await buffer(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, signingSecret)
  } catch (error) {
    console.log(getErrorMessage(error))
    return res.status(400).send(`Webhook error: ${getErrorMessage(error)}`)
  }

  switch (event.type) {
    case 'customer.subscription.updated':
      await prismaUpdateUser({
        where: {
          stripeCustomerId: event.data.object.customer.toString()
        },
        payload: {
          stripeSubscriptionId: event.data.object.id,
        }
      })
      break
    case 'customer.subscription.deleted':
      await prismaUpdateUser({
        where: {
          stripeCustomerId: event.data.object.customer.toString()
        },
        payload: {
          stripeSubscriptionId: null,
        }
      })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res
        .status(resStatusType.NOT_ALLOWED)
        .end(`Webhook ${event.type} Not Supported`)
  }

  res.send({ received: true })
}

export default handler
