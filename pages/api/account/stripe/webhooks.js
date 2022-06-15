import initStripe from 'stripe'
import { resStatusType } from '@/utils/types'
import { prismaPutUser } from '@/utils/prisma/users'
import { buffer } from 'micro'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY)
  const signingSecret = process.env.STRIPE_SIGNING_SECRET
  const signature = req.headers['stripe-signature']

  const rawBody = await buffer(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, signingSecret)
  } catch (error) {
    console.log(error)
    return res.status(400).send(`Webhook error: ${error.message}`)
  }

  switch (event.type) {
    case 'customer.subscription.updated':
      await prismaPutUser(
        { stripeCustomerId: event.data.object.customer },
        {
          stripeSubscriptionId: event.data.object.id,
        }
      )
      break
    case 'customer.subscription.deleted':
      await prismaPutUser(
        { stripeCustomerId: event.data.object.customer },
        {
          stripeSubscriptionId: null,
        }
      )
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
