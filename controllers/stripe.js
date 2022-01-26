import initStripe from 'stripe'

const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

export const createStripeCustomer = async (user) => {
  return await stripe.customers.create(user)
}

export const createStripeSubscription = async ({ customerId, priceId }) => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })
}
