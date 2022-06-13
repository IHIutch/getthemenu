import initStripe from 'stripe'

const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

export const createStripeCustomer = async (user) => {
  return await stripe.customers.create(user)
}

export const createStripeBillingSession = async (stripeCustomerId) => {
  return await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: 'http://localhost:3000/account',
  })
}
